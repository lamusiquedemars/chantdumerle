import GuidesPageView from "@/modules/guides/components/GuidesPageView/GuidesPageView";
import { getGuidesPageContent } from "@/sites/chantdumerle/content/guides";

type GuidesPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function GuidesPage({ params }: GuidesPageProps) {
  const { locale } = await params;
  const content = getGuidesPageContent(locale);

  return <GuidesPageView content={content} />;
}
