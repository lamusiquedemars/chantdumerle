<?php

declare(strict_types=1);

$dryRun = ! in_array('--apply', $argv, true);

$baseDir = dirname(__DIR__);
$sourceFile = $baseDir . '/woo-backend/wp-content/uploads/wc-imports/articles_20.html';
$prefix = 'wp_';

$pdo = new PDO(
    'mysql:host=127.0.0.1;port=3306;dbname=chantdumerle_wp;charset=utf8mb4',
    'root',
    'root',
    [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]
);

function cdm_slugify(string $value): string
{
    $slug = html_entity_decode($value, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    $slug = strtr($slug, [
        'à' => 'a',
        'â' => 'a',
        'ä' => 'a',
        'ç' => 'c',
        'é' => 'e',
        'è' => 'e',
        'ê' => 'e',
        'ë' => 'e',
        'î' => 'i',
        'ï' => 'i',
        'ô' => 'o',
        'ö' => 'o',
        'ù' => 'u',
        'û' => 'u',
        'ü' => 'u',
        'À' => 'a',
        'Â' => 'a',
        'Ä' => 'a',
        'Ç' => 'c',
        'É' => 'e',
        'È' => 'e',
        'Ê' => 'e',
        'Ë' => 'e',
        'Î' => 'i',
        'Ï' => 'i',
        'Ô' => 'o',
        'Ö' => 'o',
        'Ù' => 'u',
        'Û' => 'u',
        'Ü' => 'u',
        '’' => '',
        "'" => '',
    ]);
    $ascii = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $slug);
    $slug = $ascii === false ? $slug : $ascii;
    $slug = strtolower($slug);
    $slug = preg_replace('/[^a-z0-9]+/', '-', $slug) ?: '';
    $slug = trim($slug, '-');

    return $slug !== '' ? $slug : 'guide';
}

function cdm_fetch_one(PDO $pdo, string $sql, array $params = []): ?array
{
    $statement = $pdo->prepare($sql);
    $statement->execute($params);
    $row = $statement->fetch();

    return is_array($row) ? $row : null;
}

function cdm_fetch_value(PDO $pdo, string $sql, array $params = []): mixed
{
    $statement = $pdo->prepare($sql);
    $statement->execute($params);

    return $statement->fetchColumn();
}

function cdm_parse_guides(string $sourceFile): array
{
    $html = file_get_contents($sourceFile);
    if ($html === false) {
        throw new RuntimeException("Cannot read {$sourceFile}");
    }

    $html = preg_replace('/<!--\s*New Articles\s*-->/i', '', $html) ?? $html;
    $chunks = preg_split('/<hr\s*\/?>/i', $html) ?: [];
    $guides = [];

    foreach ($chunks as $chunk) {
        $chunk = trim($chunk);
        if ($chunk === '') {
            continue;
        }

        $document = new DOMDocument('1.0', 'UTF-8');
        libxml_use_internal_errors(true);
        $document->loadHTML(
            '<?xml encoding="utf-8" ?><div id="article-root">' . $chunk . '</div>',
            LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD
        );
        libxml_clear_errors();

        $xpath = new DOMXPath($document);
        $root = $document->getElementById('article-root');
        $titleNode = $xpath->query('.//h1[1]', $root)->item(0);
        if (! $titleNode instanceof DOMElement) {
            continue;
        }

        $metaNode = $xpath->query('.//p[contains(concat(" ", normalize-space(@class), " "), " meta ")][1]', $root)->item(0);
        $categoryNode = $xpath->query('.//p[contains(concat(" ", normalize-space(@class), " "), " category ")][1]', $root)->item(0);
        $title = trim($titleNode->textContent);
        $subtitle = $metaNode instanceof DOMElement ? trim($metaNode->textContent) : '';
        $category = $categoryNode instanceof DOMElement ? trim($categoryNode->textContent) : '';

        $titleNode->parentNode?->removeChild($titleNode);
        if ($metaNode instanceof DOMElement) {
            $metaNode->parentNode?->removeChild($metaNode);
        }
        if ($categoryNode instanceof DOMElement) {
            $categoryNode->parentNode?->removeChild($categoryNode);
        }

        $content = '';
        foreach (iterator_to_array($root->childNodes) as $child) {
            $content .= $document->saveHTML($child);
        }

        $guides[] = [
            'title' => $title,
            'slug' => cdm_slugify($title),
            'subtitle' => $subtitle,
            'category' => $category,
            'content' => trim($content),
        ];
    }

    return $guides;
}

function cdm_unique_post_slug(PDO $pdo, string $prefix, string $baseSlug, ?int $currentPostId = null): string
{
    $slug = $baseSlug;
    $suffix = 2;

    while (true) {
        $existingId = cdm_fetch_value(
            $pdo,
            "SELECT ID FROM {$prefix}posts WHERE post_name = :slug AND post_type = 'guide' LIMIT 1",
            ['slug' => $slug]
        );

        if ($existingId === false || $existingId === null || (int) $existingId === $currentPostId) {
            return $slug;
        }

        $slug = $baseSlug . '-' . $suffix;
        $suffix++;
    }
}

function cdm_find_or_create_category(PDO $pdo, string $prefix, string $category, bool $dryRun, array &$stats): ?int
{
    if ($category === '') {
        return null;
    }

    $existing = cdm_fetch_one(
        $pdo,
        "SELECT tt.term_taxonomy_id
         FROM {$prefix}terms t
         JOIN {$prefix}term_taxonomy tt ON tt.term_id = t.term_id
         WHERE tt.taxonomy = 'guide_category' AND t.name = :name
         LIMIT 1",
        ['name' => $category]
    );

    if ($existing !== null) {
        return (int) $existing['term_taxonomy_id'];
    }

    if (! in_array($category, $stats['categories_created'], true)) {
        $stats['categories_created'][] = $category;
    }
    if ($dryRun) {
        return null;
    }

    $baseSlug = cdm_slugify($category);
    $slug = $baseSlug;
    $suffix = 2;
    while (cdm_fetch_value($pdo, "SELECT term_id FROM {$prefix}terms WHERE slug = :slug LIMIT 1", ['slug' => $slug]) !== false) {
        $slug = $baseSlug . '-' . $suffix;
        $suffix++;
    }

    $pdo->prepare("INSERT INTO {$prefix}terms (name, slug, term_group) VALUES (:name, :slug, 0)")
        ->execute(['name' => $category, 'slug' => $slug]);
    $termId = (int) $pdo->lastInsertId();

    $pdo->prepare("INSERT INTO {$prefix}term_taxonomy (term_id, taxonomy, description, parent, count) VALUES (:term_id, 'guide_category', '', 0, 0)")
        ->execute(['term_id' => $termId]);

    return (int) $pdo->lastInsertId();
}

function cdm_set_post_meta(PDO $pdo, string $prefix, int $postId, string $key, string $value): void
{
    $existingId = cdm_fetch_value(
        $pdo,
        "SELECT meta_id FROM {$prefix}postmeta WHERE post_id = :post_id AND meta_key = :meta_key LIMIT 1",
        ['post_id' => $postId, 'meta_key' => $key]
    );

    if ($existingId === false || $existingId === null) {
        $pdo->prepare("INSERT INTO {$prefix}postmeta (post_id, meta_key, meta_value) VALUES (:post_id, :meta_key, :meta_value)")
            ->execute(['post_id' => $postId, 'meta_key' => $key, 'meta_value' => $value]);

        return;
    }

    $pdo->prepare("UPDATE {$prefix}postmeta SET meta_value = :meta_value WHERE meta_id = :meta_id")
        ->execute(['meta_value' => $value, 'meta_id' => (int) $existingId]);
}

function cdm_assign_category(PDO $pdo, string $prefix, int $postId, ?int $termTaxonomyId): void
{
    $pdo->prepare(
        "DELETE tr
         FROM {$prefix}term_relationships tr
         JOIN {$prefix}term_taxonomy tt ON tt.term_taxonomy_id = tr.term_taxonomy_id
         WHERE tr.object_id = :post_id AND tt.taxonomy = 'guide_category'"
    )->execute(['post_id' => $postId]);

    if ($termTaxonomyId === null) {
        return;
    }

    $pdo->prepare("INSERT INTO {$prefix}term_relationships (object_id, term_taxonomy_id, term_order) VALUES (:post_id, :term_taxonomy_id, 0)")
        ->execute(['post_id' => $postId, 'term_taxonomy_id' => $termTaxonomyId]);
}

function cdm_recount_categories(PDO $pdo, string $prefix): void
{
    $rows = $pdo->query("SELECT term_taxonomy_id FROM {$prefix}term_taxonomy WHERE taxonomy = 'guide_category'")->fetchAll();

    foreach ($rows as $row) {
        $termTaxonomyId = (int) $row['term_taxonomy_id'];
        $count = (int) cdm_fetch_value(
            $pdo,
            "SELECT COUNT(*)
             FROM {$prefix}term_relationships tr
             JOIN {$prefix}posts p ON p.ID = tr.object_id
             WHERE tr.term_taxonomy_id = :term_taxonomy_id
               AND p.post_type = 'guide'
               AND p.post_status = 'publish'",
            ['term_taxonomy_id' => $termTaxonomyId]
        );

        $pdo->prepare("UPDATE {$prefix}term_taxonomy SET count = :count WHERE term_taxonomy_id = :term_taxonomy_id")
            ->execute(['count' => $count, 'term_taxonomy_id' => $termTaxonomyId]);
    }
}

$guides = cdm_parse_guides($sourceFile);
$stats = [
    'mode' => $dryRun ? 'dry-run' : 'apply',
    'source' => $sourceFile,
    'parsed' => count($guides),
    'created' => 0,
    'updated' => 0,
    'categories_created' => [],
];

if (! $dryRun) {
    $pdo->beginTransaction();
}

try {
    foreach ($guides as $index => $guide) {
        $existing = cdm_fetch_one(
            $pdo,
            "SELECT ID FROM {$prefix}posts WHERE post_type = 'guide' AND post_name = :slug LIMIT 1",
            ['slug' => $guide['slug']]
        );
        $now = date('Y-m-d H:i:s');
        $nowGmt = gmdate('Y-m-d H:i:s');
        $categoryTermTaxonomyId = cdm_find_or_create_category($pdo, $prefix, $guide['category'], $dryRun, $stats);

        if ($existing !== null) {
            $postId = (int) $existing['ID'];
            $stats['updated']++;

            if (! $dryRun) {
                $pdo->prepare(
                    "UPDATE {$prefix}posts
                     SET post_title = :title,
                         post_content = :content,
                         post_excerpt = :excerpt,
                         post_status = 'publish',
                         post_modified = :post_modified,
                         post_modified_gmt = :post_modified_gmt,
                         menu_order = :menu_order
                     WHERE ID = :post_id"
                )->execute([
                    'title' => $guide['title'],
                    'content' => $guide['content'],
                    'excerpt' => $guide['subtitle'],
                    'post_modified' => $now,
                    'post_modified_gmt' => $nowGmt,
                    'menu_order' => $index,
                    'post_id' => $postId,
                ]);
            }
        } else {
            $stats['created']++;

            if (! $dryRun) {
                $slug = cdm_unique_post_slug($pdo, $prefix, $guide['slug']);
                $pdo->prepare(
                    "INSERT INTO {$prefix}posts (
                        post_author, post_date, post_date_gmt, post_content, post_title, post_excerpt,
                        post_status, comment_status, ping_status, post_password, post_name, to_ping,
                        pinged, post_modified, post_modified_gmt, post_content_filtered, post_parent,
                        guid, menu_order, post_type, post_mime_type, comment_count
                     ) VALUES (
                        1, :post_date, :post_date_gmt, :content, :title, :excerpt,
                        'publish', 'closed', 'closed', '', :slug, '',
                        '', :post_modified, :post_modified_gmt, '', 0,
                        '', :menu_order, 'guide', '', 0
                     )"
                )->execute([
                    'post_date' => $now,
                    'post_date_gmt' => $nowGmt,
                    'content' => $guide['content'],
                    'title' => $guide['title'],
                    'excerpt' => $guide['subtitle'],
                    'slug' => $slug,
                    'post_modified' => $now,
                    'post_modified_gmt' => $nowGmt,
                    'menu_order' => $index,
                ]);
                $postId = (int) $pdo->lastInsertId();
                $pdo->prepare("UPDATE {$prefix}posts SET guid = :guid WHERE ID = :post_id")
                    ->execute(['guid' => 'http://localhost/?post_type=guide&p=' . $postId, 'post_id' => $postId]);
            }
        }

        if (! $dryRun) {
            cdm_set_post_meta($pdo, $prefix, $postId, 'cdm_guide_subtitle', $guide['subtitle']);
            cdm_set_post_meta($pdo, $prefix, $postId, 'cdm_guide_card_label', $guide['category']);
            cdm_assign_category($pdo, $prefix, $postId, $categoryTermTaxonomyId);
        }
    }

    if (! $dryRun) {
        cdm_recount_categories($pdo, $prefix);
        $pdo->commit();
    }
} catch (Throwable $error) {
    if (! $dryRun && $pdo->inTransaction()) {
        $pdo->rollBack();
    }

    throw $error;
}

echo json_encode($stats, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . PHP_EOL;
