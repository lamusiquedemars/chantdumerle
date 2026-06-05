import type { GuideArticleBlock } from "@/modules/guides/types";

type GuideArticleBlocksProps = {
  blocks: GuideArticleBlock[];
};

// Rend les blocs editoriaux simples fournis par le contenu guide.
export default function GuideArticleBlocks({ blocks }: GuideArticleBlocksProps) {
  return blocks.map((block, index) => {
    if (block.type === "heading") {
      return block.level === 2 ? (
        <h2 key={`${block.type}-${index}`}>{block.text}</h2>
      ) : (
        <h3 key={`${block.type}-${index}`}>{block.text}</h3>
      );
    }

    if (block.type === "list") {
      return (
        <ul key={`${block.type}-${index}`}>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    }

    return <p key={`${block.type}-${index}`}>{block.text}</p>;
  });
}
