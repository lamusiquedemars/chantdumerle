import StringsPageView from "@/modules/catalog/components/StringsPageView/StringsPageView";
import { getStringsContent } from "@/sites/chantdumerle/content/strings";
import { getFeaturedStringProducts } from "@/modules/catalog/services/wordpressProducts";

type CordesPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function CordesPage({ params }: CordesPageProps) {
  const { locale } = await params;
  const content = getStringsContent(locale);

  // Les produits mis en avant restent pilotes par l'adaptateur WordPress.
  const featuredProducts = await getFeaturedStringProducts(locale);

  return (
    <StringsPageView content={content} featuredProducts={featuredProducts} />
  );
}
