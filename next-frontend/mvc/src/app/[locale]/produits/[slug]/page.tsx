import { notFound } from "next/navigation";
import ProductDetail from "@/modules/catalog/components/ProductDetail/ProductDetail";
import { getProductPageBySlug } from "@/modules/catalog/services/productPageData";

type ProductPageProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { locale, slug } = await params;
  const product = await getProductPageBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetail locale={locale} product={product} />;
}
