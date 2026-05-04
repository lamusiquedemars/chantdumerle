import type { ProductCardItem } from "@/components/product/ProductCard/ProductCard";
import { fetchGraphQL } from "@/lib/wordpress/client";

type GraphQLProductNode = {
  __typename: "SimpleProduct" | "VariableProduct" | string;
  name: string;
  slug: string;
  shortDescription?: string | null;
  image?: {
    sourceUrl?: string | null;
    altText?: string | null;
  } | null;
  productCategories?: {
    nodes: {
      name: string;
      slug: string;
    }[];
  } | null;
  price?: string | null;
  regularPrice?: string | null;
  salePrice?: string | null;
};

type FeaturedStringProductsResponse = {
  products: {
    nodes: GraphQLProductNode[];
  };
};

type ProductsResponse = {
  products: {
    nodes: GraphQLProductNode[];
  };
};

export type ProductListItem = {
  name: string;
  slug: string;
  image?: string;
};

export async function getProducts(first = 10): Promise<ProductListItem[]> {
  const data = await fetchGraphQL(
    `
      query GetProducts($first: Int = 10) {
        products(first: $first) {
          nodes {
            name
            slug
            image {
              sourceUrl
              altText
            }
          }
        }
      }
    `,
    { first }
  ) as ProductsResponse;

  return data.products.nodes.map((product) => ({
    name: product.name,
    slug: product.slug,
    image: product.image?.sourceUrl ?? undefined,
  }));
}

export async function getFeaturedStringProducts(
  locale: string,
  first = 8
): Promise<ProductCardItem[]> {
  /*
   * Cette fonction alimente le bloc "Notre sélection de cordes"
   * sur la page /cordes.
   *
   * La sélection est pilotée depuis WooCommerce :
   * - produit dans la catégorie "cordes"
   * - produit marqué "mis en avant"
   */
  const data = (await fetchGraphQL(
    `
      query GetFeaturedStringProducts($first: Int = 8) {
        products(first: $first, where: { featured: true, category: "cordes" }) {
          nodes {
            __typename
            name
            slug
            shortDescription

            image {
              sourceUrl
              altText
            }

            ... on SimpleProduct {
              price
              regularPrice
              salePrice
            }

            ... on VariableProduct {
              price
              regularPrice
              salePrice
            }
          }
        }
      }
    `,
    { first }
  )) as FeaturedStringProductsResponse;

  /*
   * ProductGrid attend des ProductCardItem.
   * On transforme donc les données Woo ici pour garder la page simple.
   */
  return data.products.nodes.map((product) => {
    /*
     * Pour la marque, on prend provisoirement une catégorie différente de "cordes".
     * Plus tard, si tu utilises un vrai attribut "Brand" ou une taxonomie marque,
     * on remplacera cette logique.
     */
    const brand = product.productCategories?.nodes.find(
      (category) => category.slug !== "cordes"
    )?.name;

    return {
      title: product.name,
      href: `/${locale}/cordes/${product.slug}`,
      /*
       * WooGraphQL renvoie souvent du HTML dans shortDescription.
       * Ici on le garde tel quel uniquement si ProductCard accepte du texte simple.
       * Si tu vois des balises HTML dans la carte, on fera un nettoyage propre après.
       */
      description: product.shortDescription ?? undefined,
      /*
       * price est préférable car Woo peut déjà formater le prix,
       * notamment pour les produits variables.
       */
      price: product.price ?? product.regularPrice ?? undefined,
      /*
       * Image principale du produit WooCommerce.
       */
      image: product.image?.sourceUrl ?? undefined,
      /*
       * Marque provisoire.
       * À remplacer ensuite par un vrai champ marque si besoin.
       */
      brand,
    };
  });
}