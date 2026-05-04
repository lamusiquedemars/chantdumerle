import { fetchGraphQL } from "@/lib/wordpress/client";
import { WordPressPost } from "@/types/wordpress";

type PostsResponse = {
  posts: {
    nodes: {
      title: string;
      slug: string;
      excerpt: string;
      content: string;
    }[];
  };
};

export async function getPosts(first = 10): Promise<WordPressPost[]> {
  const data = (await fetchGraphQL(
    `
      query GetPosts($first: Int = 10) {
        posts(first: $first) {
          nodes {
            title
            slug
            excerpt
            content
          }
        }
      }
    `,
    { first }
  )) as PostsResponse;

  return data.posts.nodes;
}