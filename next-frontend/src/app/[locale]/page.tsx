import { getFeaturedStringProducts } from "@/modules/catalog/services/wordpressProducts";
import HomePageView from "@/modules/pages/components/HomePageView/HomePageView";
import { getHomeContent } from "@/sites/chantdumerle/content/home";

type HomePageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const content = getHomeContent(locale);

  // Les produits restent dynamiques pendant que les textes vivent dans le contenu client.
  const featuredProducts = (await getFeaturedStringProducts(locale, 4)).map(
    (product) => ({
      title: product.title,
      href: product.href,
      image: product.image,
      brand: product.brand,
    })
  );

  return <HomePageView content={content} featuredProducts={featuredProducts} />;
}
