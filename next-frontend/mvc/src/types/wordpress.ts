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
