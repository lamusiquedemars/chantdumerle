import { notFound } from "next/navigation";
import GuideArticlePageView from "@/modules/guides/components/GuideArticlePageView/GuideArticlePageView";
import { getGuidePageBySlug } from "@/modules/guides/services/wordpressGuides";

type GuidePageProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

export default async function GuidePage({ params }: GuidePageProps) {
  const { locale, slug } = await params;
  const content = await getGuidePageBySlug(locale, slug);

  if (!content) {
    notFound();
  }

  return <GuideArticlePageView content={content} locale={locale} />;
}
