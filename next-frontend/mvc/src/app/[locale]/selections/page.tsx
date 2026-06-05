import Container from "@/components/layout/Container/Container";
import Section from "@/components/layout/Section/Section";
import SectionHeading from "@/components/ui/SectionHeading/SectionHeading";
import { selectionsPageContent } from "@/sites/example/content/selections";

export default function SelectionsPage() {
  return (
    <Section>
      <Container>
        <SectionHeading title={selectionsPageContent.title} />

        {selectionsPageContent.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </Container>
    </Section>
  );
}
