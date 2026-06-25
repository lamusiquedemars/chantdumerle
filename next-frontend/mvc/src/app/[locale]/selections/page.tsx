import SelectionsPageView from "@/modules/selections/components/SelectionsPageView/SelectionsPageView";
import { getGuideCards } from "@/modules/guides/services/wordpressGuides";

type SelectionsPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function SelectionsPage({ params }: SelectionsPageProps) {
  const { locale } = await params;
  const guideItems = await getGuideCards(locale, 3);

  return <SelectionsPageView locale={locale} guideItems={guideItems} />;
}
