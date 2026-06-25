import type { Metadata } from "next";
import SimplePage from "@/modules/staticPages/components/SimplePage/SimplePage";
import StaticPageContent from "@/modules/staticPages/components/StaticPageContent/StaticPageContent";
import { contactPageContent } from "@/content/legal";

export const metadata: Metadata = contactPageContent.metadata;

export default function ContactPage() {
  return (
    <SimplePage title={contactPageContent.title} intro={contactPageContent.intro}>
      <StaticPageContent content={contactPageContent} />
    </SimplePage>
  );
}
