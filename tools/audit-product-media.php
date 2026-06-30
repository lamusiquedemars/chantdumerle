<?php
declare(strict_types=1);

/**
 * Read-only audit for Woo product gallery media.
 *
 * Checks:
 * - product featured/gallery attachment references that point to missing media;
 * - missing original files and generated image sizes;
 * - exact duplicate original media files by SHA-256 hash.
 */

$wpLoad = dirname(__DIR__) . '/woo-backend/wp-load.php';

if (!file_exists($wpLoad)) {
    fwrite(STDERR, "Cannot find wp-load.php at {$wpLoad}\n");
    exit(1);
}

require_once $wpLoad;

global $wpdb;

$upload = wp_get_upload_dir();
$baseDir = rtrim((string) $upload['basedir'], '/');
$baseUrl = rtrim((string) $upload['baseurl'], '/');

function audit_abs_path(string $baseDir, string $relative): string
{
    return $baseDir . '/' . ltrim($relative, '/');
}

function audit_attachment_info(int $attachmentId, string $baseDir): array
{
    $relative = (string) get_post_meta($attachmentId, '_wp_attached_file', true);
    $metadata = wp_get_attachment_metadata($attachmentId);
    $originalPath = $relative !== '' ? audit_abs_path($baseDir, $relative) : '';
    $missingSizes = [];

    if (is_array($metadata) && isset($metadata['sizes']) && is_array($metadata['sizes'])) {
        $dir = dirname($relative);

        foreach ($metadata['sizes'] as $sizeName => $sizeData) {
            if (!is_array($sizeData) || empty($sizeData['file'])) {
                continue;
            }

            $sizePath = audit_abs_path($baseDir, $dir . '/' . $sizeData['file']);

            if (!file_exists($sizePath)) {
                $missingSizes[] = (string) $sizeName . ':' . $dir . '/' . $sizeData['file'];
            }
        }
    }

    return [
        'id' => $attachmentId,
        'title' => get_the_title($attachmentId),
        'relative' => $relative,
        'original_path' => $originalPath,
        'original_exists' => $originalPath !== '' && file_exists($originalPath),
        'missing_sizes' => $missingSizes,
    ];
}

$products = $wpdb->get_results(
    "SELECT ID, post_title FROM {$wpdb->posts} WHERE post_type = 'product' AND post_status IN ('publish', 'draft', 'private') ORDER BY ID ASC"
);

$referencedAttachmentIds = [];
$productImageIds = [];
$missingAttachmentPosts = [];
$repeatedGalleryIds = [];

foreach ($products as $product) {
    $productId = (int) $product->ID;
    $imageIds = [];
    $featuredId = (int) get_post_meta($productId, '_thumbnail_id', true);

    if ($featuredId > 0) {
        $imageIds[] = $featuredId;
    }

    $galleryMeta = (string) get_post_meta($productId, '_product_image_gallery', true);
    $galleryIds = array_values(array_filter(array_map('intval', preg_split('/\s*,\s*/', $galleryMeta) ?: [])));

    if (count($galleryIds) !== count(array_unique($galleryIds))) {
        $repeatedGalleryIds[] = [
            'product_id' => $productId,
            'product_title' => (string) $product->post_title,
            'gallery' => $galleryMeta,
        ];
    }

    $imageIds = array_merge($imageIds, $galleryIds);
    $productImageIds[$productId] = [
        'product_title' => (string) $product->post_title,
        'attachment_ids' => $imageIds,
    ];

    foreach ($imageIds as $attachmentId) {
        if ($attachmentId <= 0) {
            continue;
        }

        $referencedAttachmentIds[$attachmentId][] = [
            'product_id' => $productId,
            'product_title' => (string) $product->post_title,
        ];

        if (get_post_type($attachmentId) !== 'attachment') {
            $missingAttachmentPosts[] = [
                'product_id' => $productId,
                'product_title' => (string) $product->post_title,
                'attachment_id' => $attachmentId,
            ];
        }
    }
}

$missingOriginals = [];
$missingGeneratedSizes = [];

foreach (array_keys($referencedAttachmentIds) as $attachmentId) {
    if (get_post_type($attachmentId) !== 'attachment') {
        continue;
    }

    $info = audit_attachment_info((int) $attachmentId, $baseDir);

    if (!$info['original_exists']) {
        $missingOriginals[] = [
            'attachment' => $info,
            'products' => $referencedAttachmentIds[$attachmentId],
        ];
    }

    if ($info['missing_sizes'] !== []) {
        $missingGeneratedSizes[] = [
            'attachment' => $info,
            'products' => $referencedAttachmentIds[$attachmentId],
        ];
    }
}

$allAttachments = $wpdb->get_results(
    "SELECT p.ID, p.post_title, pm.meta_value AS attached_file
     FROM {$wpdb->posts} p
     INNER JOIN {$wpdb->postmeta} pm ON pm.post_id = p.ID AND pm.meta_key = '_wp_attached_file'
     WHERE p.post_type = 'attachment'
       AND p.post_mime_type LIKE 'image/%'
       AND pm.meta_value <> ''
     ORDER BY p.ID ASC"
);

$hashGroups = [];
$attachmentHashes = [];

foreach ($allAttachments as $attachment) {
    $relative = (string) $attachment->attached_file;
    $path = audit_abs_path($baseDir, $relative);

    if (!is_file($path)) {
        continue;
    }

    $hash = hash_file('sha256', $path);
    $size = filesize($path);
    $key = $hash . ':' . $size;
    $attachmentHashes[(int) $attachment->ID] = $key;

    $hashGroups[$key][] = [
        'id' => (int) $attachment->ID,
        'title' => (string) $attachment->post_title,
        'relative' => $relative,
        'size' => $size,
        'used_by_products' => count($referencedAttachmentIds[(int) $attachment->ID] ?? []),
    ];
}

$duplicateGroups = array_values(array_filter($hashGroups, static fn (array $items): bool => count($items) > 1));
usort($duplicateGroups, static function (array $left, array $right): int {
    return count($right) <=> count($left);
});

$productsWithDuplicateImageContent = [];

foreach ($productImageIds as $productId => $productData) {
    $seenByHash = [];

    foreach (array_unique($productData['attachment_ids']) as $attachmentId) {
        $hash = $attachmentHashes[$attachmentId] ?? null;

        if ($hash === null) {
            continue;
        }

        $seenByHash[$hash][] = $attachmentId;
    }

    $duplicateSets = array_values(array_filter($seenByHash, static fn (array $ids): bool => count($ids) > 1));

    if ($duplicateSets !== []) {
        $productsWithDuplicateImageContent[] = [
            'product_id' => $productId,
            'product_title' => $productData['product_title'],
            'duplicate_sets' => $duplicateSets,
        ];
    }
}

printf("Upload base: %s\n", $baseDir);
printf("Upload URL: %s\n", $baseUrl);
printf("Products scanned: %d\n", count($products));
printf("Referenced attachment IDs: %d\n", count($referencedAttachmentIds));
printf("Missing attachment posts: %d\n", count($missingAttachmentPosts));
printf("Missing original files used by products: %d\n", count($missingOriginals));
printf("Attachments with missing generated sizes used by products: %d\n", count($missingGeneratedSizes));
printf("Products with repeated gallery IDs: %d\n", count($repeatedGalleryIds));
printf("Products with duplicate image content: %d\n", count($productsWithDuplicateImageContent));
printf("Exact duplicate original-file groups: %d\n", count($duplicateGroups));

$limit = 20;

if ($missingAttachmentPosts !== []) {
    echo "\nMissing attachment post references (first {$limit}):\n";
    foreach (array_slice($missingAttachmentPosts, 0, $limit) as $item) {
        printf(
            "- product #%d %s references missing attachment #%d\n",
            $item['product_id'],
            $item['product_title'],
            $item['attachment_id']
        );
    }
}

if ($missingOriginals !== []) {
    echo "\nMissing original files used by products (first {$limit}):\n";
    foreach (array_slice($missingOriginals, 0, $limit) as $item) {
        $attachment = $item['attachment'];
        $product = $item['products'][0];
        printf(
            "- attachment #%d %s (%s), first product #%d %s\n",
            $attachment['id'],
            $attachment['title'],
            $attachment['relative'],
            $product['product_id'],
            $product['product_title']
        );
    }
}

if ($missingGeneratedSizes !== []) {
    echo "\nMissing generated sizes used by products (first {$limit}):\n";
    foreach (array_slice($missingGeneratedSizes, 0, $limit) as $item) {
        $attachment = $item['attachment'];
        $product = $item['products'][0];
        printf(
            "- attachment #%d %s, missing [%s], first product #%d %s\n",
            $attachment['id'],
            $attachment['title'],
            implode(', ', array_slice($attachment['missing_sizes'], 0, 4)),
            $product['product_id'],
            $product['product_title']
        );
    }
}

if ($repeatedGalleryIds !== []) {
    echo "\nProducts with repeated gallery IDs (first {$limit}):\n";
    foreach (array_slice($repeatedGalleryIds, 0, $limit) as $item) {
        printf(
            "- product #%d %s gallery=%s\n",
            $item['product_id'],
            $item['product_title'],
            $item['gallery']
        );
    }
}

if ($productsWithDuplicateImageContent !== []) {
    echo "\nProducts with duplicate image content (first {$limit}):\n";
    foreach (array_slice($productsWithDuplicateImageContent, 0, $limit) as $item) {
        $sets = array_map(
            static fn (array $ids): string => implode('/', $ids),
            $item['duplicate_sets']
        );

        printf(
            "- product #%d %s duplicate attachment sets=%s\n",
            $item['product_id'],
            $item['product_title'],
            implode(', ', $sets)
        );
    }
}

if ($duplicateGroups !== []) {
    echo "\nExact duplicate original-file groups (first {$limit}):\n";
    foreach (array_slice($duplicateGroups, 0, $limit) as $index => $group) {
        printf("- group %d (%d files):\n", $index + 1, count($group));

        foreach (array_slice($group, 0, 8) as $item) {
            printf(
                "  #%d used_by=%d size=%d %s\n",
                $item['id'],
                $item['used_by_products'],
                $item['size'],
                $item['relative']
            );
        }
    }
}
