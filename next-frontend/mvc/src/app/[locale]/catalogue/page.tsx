import CatalogPageView from "@/modules/catalog/components/CatalogPageView/CatalogPageView";
import { getCatalogContent } from "@/sites/example/content/catalog";
import { getFeaturedProducts } from "@/modules/catalog/services/wordpressProducts";

type CordesPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function CataloguePage({ params }: CordesPageProps) {
  const { locale } = await params;
  const content = getCatalogContent(locale);

  // Les produits viennent du backend actif ou du fallback local.
  const featuredProducts = await getFeaturedProducts(locale);

  return (
    <CatalogPageView content={content} featuredProducts={featuredProducts} />
  );
}
