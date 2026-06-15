import { notFound } from "next/navigation";
import SelectionDetailPageView from "@/modules/selections/components/SelectionDetailPageView/SelectionDetailPageView";
import { getSelectionDetailPageData } from "@/modules/selections/services/selectionRecommendations";

type SelectionDetailPageProps = {
  params: Promise<{
    locale: string;
    kind: string;
    slug: string;
  }>;
  searchParams?: Promise<{
    instrument?: string | string[];
  }>;
};

function readSingleParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function SelectionDetailPage({
  params,
  searchParams,
}: SelectionDetailPageProps) {
  const { locale, kind, slug } = await params;
  const query = searchParams ? await searchParams : {};
  const data = await getSelectionDetailPageData({
    locale,
    kind,
    slug,
    instrument: readSingleParam(query.instrument),
    limit: 10,
  });

  if (!data) {
    notFound();
  }

  return <SelectionDetailPageView data={data} locale={locale} />;
}
