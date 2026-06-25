import type { Metadata } from "next";
import SimplePage from "@/modules/staticPages/components/SimplePage/SimplePage";
import StaticPageContent from "@/modules/staticPages/components/StaticPageContent/StaticPageContent";
import { termsOfSalePageContent } from "@/content/legal";

export const metadata: Metadata = termsOfSalePageContent.metadata;

export default function TermsOfSalePage() {
  return (
    <SimplePage
      title={termsOfSalePageContent.title}
      intro={termsOfSalePageContent.intro}
    >
      <StaticPageContent content={termsOfSalePageContent} />
    </SimplePage>
  );
}
