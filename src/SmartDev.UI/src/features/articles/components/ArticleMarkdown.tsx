import { getUniqueArticleSectionId } from '../utils/articleContent';

interface ArticleMarkdownProps {
  markdown: string;
}

interface MarkdownListItem {
  content: string;
  children: MarkdownListItem[];
}

interface ParsedListItem {
  content: string;
  indentation: number;
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

const getIndentation = (value: string) => value.replace(/\t/g, '    ').length;

const parseMarkdownList = (block: string): MarkdownListItem[] => {
  const parsedItems = block.split('\n').flatMap((line): ParsedListItem[] => {
    const match = /^(\s*)[-*]\s+(.+)$/.exec(line);
    return match ? [{ content: match[2], indentation: getIndentation(match[1]) }] : [];
  });

  const parseLevel = (startIndex: number, indentation: number): [MarkdownListItem[], number] => {
    const items: MarkdownListItem[] = [];
    let index = startIndex;

    while (index < parsedItems.length) {
      const parsedItem = parsedItems[index];

      if (parsedItem.indentation < indentation) break;

      if (parsedItem.indentation > indentation) {
        const parent = items.at(-1);
        if (!parent) break;

        const [children, nextIndex] = parseLevel(index, parsedItem.indentation);
        parent.children.push(...children);
        index = nextIndex;
        continue;
      }

      items.push({ content: parsedItem.content, children: [] });
      index += 1;
    }

    return [items, index];
  };

  return parsedItems.length > 0 ? parseLevel(0, parsedItems[0].indentation)[0] : [];
};

const renderMarkdownList = (items: MarkdownListItem[], depth = 0, key?: number) => (
  <ul key={key} className={`${depth === 0 ? 'list-disc' : depth === 1 ? 'list-[circle]' : 'list-[square]'} ${depth === 0 ? 'pl-5' : 'mt-2 pl-6'} space-y-2 text-base leading-7 text-foreground`}>
    {items.map((item, index) => (
      <li key={`${item.content}-${index}`}>
        {item.content}
        {item.children.length > 0 ? renderMarkdownList(item.children, depth + 1) : null}
      </li>
    ))}
  </ul>
);

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

  const listItems = parseMarkdownList(block);

  if (listItems.length > 0) {
    return renderMarkdownList(listItems, 0, index);
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
