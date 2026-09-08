import { getUniqueArticleSectionId } from '../utils/articleContent';

interface ArticleMarkdownProps {
  markdown: string;
}

const splitMarkdownBlocks = (markdown: string): string[] => {
  const blocks: string[] = [];
  let lines: string[] = [];
  let blockType: 'paragraph' | 'list' | 'code' | null = null;

  const flush = () => {
    if (lines.length > 0) blocks.push(lines.join('\n'));
    lines = [];
    blockType = null;
  };

  for (const line of markdown.replace(/\r\n?/g, '\n').split('\n')) {
    const trimmedLine = line.trim();

    if (blockType === 'code') {
      lines.push(line);
      if (trimmedLine === '```') flush();
      continue;
    }

    if (trimmedLine.startsWith('```')) {
      flush();
      blockType = 'code';
      lines.push(line);
    } else if (!trimmedLine) {
      flush();
    } else if (/^#{1,4}\s+.+$/.test(trimmedLine)) {
      flush();
      blocks.push(trimmedLine);
    } else {
      const nextType = /^[-*]\s+.+$/.test(trimmedLine) ? 'list' : 'paragraph';
      if (blockType !== nextType) flush();
      blockType = nextType;
      lines.push(line);
    }
  }

  flush();
  return blocks;
};

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
  const blocks = splitMarkdownBlocks(markdown);
  const usedHeadingIds = new Map<string, number>();
  return <>{blocks.map((block, index) => renderMarkdownBlock(block, index, usedHeadingIds))}</>;
};
