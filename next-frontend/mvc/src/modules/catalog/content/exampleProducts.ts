import type { ProductCardItem } from "@/modules/catalog/components/ProductCard/ProductCard";
import type { ProductPageItem } from "@/modules/catalog/services/wordpressProducts";

const detailBasePath = "produits";

function href(locale: string, slug: string) {
  return `/${locale}/${detailBasePath}/${slug}`;
}

const exampleProductPages: ProductPageItem[] = [
  {
    id: "example-product-1",
    databaseId: 1001,
    typename: "ExampleProduct",
    productType: "simple",
    name: "Produit exemple essentiel",
    slug: "produit-exemple-essentiel",
    sku: "EX-001",
    shortDescription:
      "<p>Un produit de demonstration pour valider une fiche catalogue sans backend.</p>",
    description:
      "<p>Cette fiche sert de contenu exemple pour le starter MVC headless. Elle permet de verifier les vues, les champs produit et le bouton d'action sans dependance WordPress.</p>",
    price: "49,00 €",
    regularPrice: "49,00 €",
    stockQuantity: 6,
    stockStatus: "IN_STOCK",
    purchasable: true,
    image: {
      sourceUrl: "/images/violin-head.jpg",
      altText: "Produit exemple",
    },
    categories: [{ name: "Catalogue", slug: "catalogue" }],
    identity: [
      { label: "Marque", value: "Marque exemple", slug: "marque-exemple" },
      { label: "Usage", value: "Demonstration", slug: "demonstration" },
    ],
    sound: [
      { label: "Profil", value: "Equilibre", slug: "equilibre" },
      { label: "Reponse", value: "Souple", slug: "souple" },
    ],
    technical: [
      { label: "Reference", value: "EX-001", slug: "ex-001" },
    ],
  },
  {
    id: "example-product-2",
    databaseId: 1002,
    typename: "ExampleProduct",
    productType: "simple",
    name: "Produit exemple avance",
    slug: "produit-exemple-avance",
    sku: "EX-002",
    shortDescription:
      "<p>Une seconde reference exemple pour tester les grilles et carrousels.</p>",
    description:
      "<p>Ce produit complete le jeu de donnees local du module catalogue.</p>",
    price: "79,00 €",
    regularPrice: "79,00 €",
    stockQuantity: 3,
    stockStatus: "IN_STOCK",
    purchasable: true,
    image: {
      sourceUrl: "/images/brand/hero-home-drawer.png",
      altText: "Second produit exemple",
    },
    categories: [{ name: "Catalogue", slug: "catalogue" }],
    identity: [
      { label: "Marque", value: "Marque exemple", slug: "marque-exemple" },
      { label: "Gamme", value: "Avancee", slug: "avancee" },
    ],
    sound: [{ label: "Profil", value: "Precis", slug: "precis" }],
    technical: [{ label: "Reference", value: "EX-002", slug: "ex-002" }],
  },
];

// Donnees catalogue minimales pour faire tourner le starter sans CMS.
export function getExampleProductCards(
  locale: string = "fr",
  first = 8
): ProductCardItem[] {
  return exampleProductPages.slice(0, first).map((product) => ({
    title: product.name,
    href: href(locale, product.slug),
    description: product.shortDescription ?? undefined,
    price: product.price ?? undefined,
    image: product.image?.sourceUrl ?? undefined,
    brand: product.identity[0]?.value,
  }));
}

export function getExampleProductPageBySlug(slug: string) {
  return exampleProductPages.find((product) => product.slug === slug) ?? null;
}
