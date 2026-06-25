import Link from "next/link";
import {
  SimplePageSection,
  simplePageStyles,
} from "@/modules/staticPages/components/SimplePage/SimplePage";
import type {
  LegalPageBlock,
  LegalPageContent,
  RichTextPart,
} from "@/content/legal";

type StaticPageContentProps = {
  content: LegalPageContent;
};

export default function StaticPageContent({ content }: StaticPageContentProps) {
  return (
    <>
      {content.sections.map((section, sectionIndex) => (
        <SimplePageSection
          key={section.title ?? sectionIndex}
          title={section.title}
        >
          {section.blocks.map((block, blockIndex) => (
            <StaticPageBlock key={blockIndex} block={block} />
          ))}
        </SimplePageSection>
      ))}
    </>
  );
}

function StaticPageBlock({ block }: { block: LegalPageBlock }) {
  if (block.type === "list") {
    return (
      <ul className={block.plain ? simplePageStyles.listPlain : undefined}>
        {block.items.map((item, index) => (
          <li key={index}>
            <RichText parts={item} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <p className={block.variant === "note" ? simplePageStyles.note : undefined}>
      <RichText parts={block.text} />
    </p>
  );
}

function RichText({ parts }: { parts: RichTextPart[] }) {
  return (
    <>
      {parts.map((part, index) => {
        if (typeof part === "string") {
          return part;
        }

        if (part.type === "internalLink") {
          return (
            <Link
              key={`${part.href}-${index}`}
              className={simplePageStyles.link}
              href={part.href}
            >
              {part.label}
            </Link>
          );
        }

        return (
          <a
            key={`${part.href}-${index}`}
            className={simplePageStyles.link}
            href={part.href}
          >
            {part.label}
          </a>
        );
      })}
    </>
  );
}
