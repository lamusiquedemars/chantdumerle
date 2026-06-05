import GuideArticlePageView from "@/modules/guides/components/GuideArticlePageView/GuideArticlePageView";
import { getChooseStringsGuideContent } from "@/sites/chantdumerle/content/guides";

type CommentChoisirSesCordesPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function CommentChoisirSesCordesPage({
  params,
}: CommentChoisirSesCordesPageProps) {
  const { locale } = await params;
  const content = getChooseStringsGuideContent(locale);

  return <GuideArticlePageView content={content} />;
}
