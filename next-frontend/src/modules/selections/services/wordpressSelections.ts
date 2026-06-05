import { fetchGraphQL } from "@/lib/wordpress/client";

export type SelectionListItem = {
  title: string;
  slug: string;
  excerpt?: string;
};

type SelectionsResponse = {
  posts: {
    nodes: {
      title: string;
      slug: string;
      excerpt?: string;
    }[];
  };
};

export async function getSelections(first = 10): Promise<SelectionListItem[]> {
  const data = (await fetchGraphQL(
    `
      query GetSelections($first: Int = 10) {
        posts(first: $first, where: { categoryName: "selections" }) {
          nodes {
            title
            slug
            excerpt
          }
        }
      }
    `,
    { first }
  )) as SelectionsResponse;

  return data.posts.nodes;
}
