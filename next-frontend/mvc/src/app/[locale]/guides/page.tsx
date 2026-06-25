import GuidesPageView from "@/modules/guides/components/GuidesPageView/GuidesPageView";
import { getGuideCards } from "@/modules/guides/services/wordpressGuides";
import { getGuidesPageContent } from "@/content/guides";

type GuidesPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function GuidesPage({ params }: GuidesPageProps) {
  const { locale } = await params;
  const guideItems = await getGuideCards(locale);
  const content = getGuidesPageContent(guideItems);

  return <GuidesPageView content={content} locale={locale} />;
}
