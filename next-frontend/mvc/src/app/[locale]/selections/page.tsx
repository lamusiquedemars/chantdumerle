import SelectionsPageView from "@/modules/selections/components/SelectionsPageView/SelectionsPageView";

type SelectionsPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function SelectionsPage({ params }: SelectionsPageProps) {
  const { locale } = await params;

  return <SelectionsPageView locale={locale} />;
}
