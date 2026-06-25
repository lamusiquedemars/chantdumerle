import type { Metadata } from "next";
import SimplePage from "@/modules/staticPages/components/SimplePage/SimplePage";
import StaticPageContent from "@/modules/staticPages/components/StaticPageContent/StaticPageContent";
import { privacyPolicyPageContent } from "@/content/legal";

export const metadata: Metadata = privacyPolicyPageContent.metadata;

export default function PrivacyPolicyPage() {
  return (
    <SimplePage
      title={privacyPolicyPageContent.title}
      intro={privacyPolicyPageContent.intro}
    >
      <StaticPageContent content={privacyPolicyPageContent} />
    </SimplePage>
  );
}
