import Hero from "@/components/blocks/Hero/Hero";
import ProductDetail from "@/modules/catalog/components/ProductDetail/ProductDetail";
import type { ProductPageItem } from "@/modules/catalog/services/productPageData";
import type { BowsContent } from "@/modules/catalog/types";

type BowsPageViewProps = {
  locale: string;
  content: BowsContent;
  featuredProduct: ProductPageItem | null;
};

export default function BowsPageView({
  locale,
  content,
  featuredProduct,
}: BowsPageViewProps) {
  return (
    <>
      <Hero
        title={content.hero.title}
        subtitle={content.hero.subtitle}
        backgroundImage={content.hero.backgroundImage}
        height="compact"
        actions={[]}
      />

      {featuredProduct ? (
        <ProductDetail locale={locale} product={featuredProduct} />
      ) : null}
    </>
  );
}
