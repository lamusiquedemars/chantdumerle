/* * This file contains TypeScript types for WordPress data structures used in the Chant du Merle project.
 * It defines types for products, pages, and posts as they are represented in the WordPress backend.
 */
export type ProductListItem = {
  name: string;
  slug: string;
};

export type WordPressPage = {
  title: string;
  slug: string;
  content: string;
};

export type WordPressPost = {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
};