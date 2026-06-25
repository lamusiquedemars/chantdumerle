import type { Metadata } from "next";
import SimplePage from "@/modules/staticPages/components/SimplePage/SimplePage";
import StaticPageContent from "@/modules/staticPages/components/StaticPageContent/StaticPageContent";
import { legalNoticePageContent } from "@/content/legal";

export const metadata: Metadata = legalNoticePageContent.metadata;

export default function LegalNoticePage() {
  return (
    <SimplePage title={legalNoticePageContent.title}>
      <StaticPageContent content={legalNoticePageContent} />
    </SimplePage>
  );
}
