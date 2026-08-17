import { getUniqueArticleSectionId } from '../utils/articleContent';

interface ArticleMarkdownProps {
  markdown: string;
}

const renderMarkdownBlock = (block: string, index: number, usedHeadingIds: Map<string, number>) => {
  const trimmedBlock = block.trim();
  const heading = /^(#{1,4})\s+(.+)$/.exec(trimmedBlock);

  if (heading) {
    const level = heading[1].length;
    const title = heading[2];
    const HeadingTag = `h${Math.min(level + 1, 4)}` as 'h2' | 'h3' | 'h4';

    return (
      <HeadingTag key={`${title}-${index}`} id={getUniqueArticleSectionId(title, usedHeadingIds)} className="scroll-mt-28 border-t border-border pt-8 text-xl font-extrabold leading-tight first:border-t-0 first:pt-0">
        {title}
      </HeadingTag>
    );
  }

  if (trimmedBlock.startsWith('```')) {
    return (
      <pre key={index} className="overflow-x-auto rounded-md bg-foreground p-4 text-sm leading-6 text-background">
        <code>
          {trimmedBlock
            .replace(/^```[a-zA-Z]*\n?/, '')
            .replace(/```$/, '')
            .trim()}
        </code>
      </pre>
    );
  }

  const listItemMatches = trimmedBlock
    .split('\n')
    .map((line) => /^[-*]\s+(.+)$/.exec(line.trim()))
    .filter((match): match is RegExpExecArray => match !== null);

  if (listItemMatches.length > 0) {
    return (
      <ul key={index} className="list-disc space-y-2 pl-5 text-base leading-7 text-foreground">
        {listItemMatches.map((item) => (
          <li key={item[1]}>{item[1]}</li>
        ))}
      </ul>
    );
  }

  return (
    <p key={index} className="text-base leading-8 text-foreground">
      {trimmedBlock}
    </p>
  );
};

export const ArticleMarkdown = ({ markdown }: ArticleMarkdownProps) => {
  const blocks = markdown.split(/\n{2,}/).filter((block) => block.trim().length > 0);
  const usedHeadingIds = new Map<string, number>();
  return <>{blocks.map((block, index) => renderMarkdownBlock(block, index, usedHeadingIds))}</>;
};
