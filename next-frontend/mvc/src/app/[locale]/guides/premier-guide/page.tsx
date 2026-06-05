import GuideArticlePageView from "@/modules/guides/components/GuideArticlePageView/GuideArticlePageView";
import { getFirstGuideContent } from "@/sites/example/content/guides";

type PremierGuidePageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function PremierGuidePage({
  params,
}: PremierGuidePageProps) {
  const { locale } = await params;
  const content = getFirstGuideContent(locale);

  return <GuideArticlePageView content={content} />;
}
