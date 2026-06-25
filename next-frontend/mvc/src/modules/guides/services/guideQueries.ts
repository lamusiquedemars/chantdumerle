import { fetchGraphQL } from "@/lib/wordpress/client";

export type GraphQLGuideNode = {
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  guideSubtitle?: string | null;
  guideCardLabel?: string | null;
  guideCtaTitle?: string | null;
  guideCtaText?: string | null;
  guideCtaPrimaryLabel?: string | null;
  guideCtaPrimaryUrl?: string | null;
  guideCtaSecondaryLabel?: string | null;
  guideCtaSecondaryUrl?: string | null;
};

type GuidesResponse = {
  guides: {
    nodes: GraphQLGuideNode[];
  };
};

type GuideResponse = {
  guide?: GraphQLGuideNode | null;
};

const GUIDE_FIELDS = `
  title
  slug
  excerpt
  content
  guideSubtitle
  guideCardLabel
  guideCtaTitle
  guideCtaText
  guideCtaPrimaryLabel
  guideCtaPrimaryUrl
  guideCtaSecondaryLabel
  guideCtaSecondaryUrl
`;

// Keep WordPress GraphQL syntax isolated here so UI services do not carry query strings.
export async function fetchGuideNodes(first = 30): Promise<GraphQLGuideNode[]> {
  const data = (await fetchGraphQL(
    `
      query GetGuides($first: Int = 30) {
        guides(first: $first, where: { orderby: { field: MENU_ORDER, order: ASC } }) {
          nodes {
            ${GUIDE_FIELDS}
          }
        }
      }
    `,
    { first }
  )) as GuidesResponse;

  return data.guides.nodes;
}

export async function fetchGuideNodeBySlug(
  slug: string
): Promise<GraphQLGuideNode | null> {
  const data = (await fetchGraphQL(
    `
      query GetGuideBySlug($slug: ID!) {
        guide(id: $slug, idType: SLUG) {
          ${GUIDE_FIELDS}
        }
      }
    `,
    { slug }
  )) as GuideResponse;

  return data.guide ?? null;
}
