import BowsPageView from "@/modules/catalog/components/BowsPageView/BowsPageView";
import { getBowsContent } from "@/content/bows";
import { getProductPageBySlug } from "@/modules/catalog/services/productPageData";

const FEATURED_BOW_SLUG = "archet-pour-violon-le-merle";

type ArchetsPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function ArchetsPage({ params }: ArchetsPageProps) {
  const { locale } = await params;
  const content = getBowsContent(locale);
  const featuredProduct = await getProductPageBySlug(FEATURED_BOW_SLUG);

  return (
    <BowsPageView
      locale={locale}
      content={content}
      featuredProduct={featuredProduct}
    />
  );
}
