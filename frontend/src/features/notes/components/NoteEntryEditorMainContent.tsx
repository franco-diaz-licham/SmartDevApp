import type { ChangeEvent } from 'react';
import { useId } from 'react';
import { AppInputText } from '@/components/ui/AppInputText';
import { AppInputTextArea } from '@/components/ui/AppInputTextArea';

export type NoteEditorMode = 'edit' | 'preview';

interface NoteEntryEditorMainContentProps {
  bodyMarkdown: string;
  bodyMarkdownError?: string;
  mode: NoteEditorMode;
  title: string;
  titleError?: string;
  onBodyMarkdownBlur: () => void;
  onBodyMarkdownChange: (value: string) => void;
  onModeChange: (mode: NoteEditorMode) => void;
  onTitleBlur: () => void;
  onTitleChange: (value: string) => void;
}

const renderMarkdownPreview = (markdown: string) => {
  const blocks = markdown.split(/\n{2,}/).filter((block) => block.trim().length > 0);
  if (blocks.length === 0) {
    return <p className="text-sm text-muted-foreground">Nothing to preview yet.</p>;
  }

  return blocks.map((block, index) => {
    const trimmedBlock = block.trim();
    const heading = /^(#{1,4})\s+(.+)$/.exec(trimmedBlock);

    if (heading) {
      const HeadingTag = `h${Math.min(heading[1].length + 1, 4)}` as 'h2' | 'h3' | 'h4';
      return (
        <HeadingTag key={`${heading[2]}-${index}`} className="text-xl font-extrabold leading-tight">
          {heading[2]}
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

    return (
      <p key={index} className="text-base leading-8 text-foreground">
        {trimmedBlock}
      </p>
    );
  });
};

const getInputValue = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => event.target.value;

export const NoteEntryEditorMainContent = ({ bodyMarkdown, bodyMarkdownError, mode, title, titleError, onBodyMarkdownBlur, onBodyMarkdownChange, onModeChange, onTitleBlur, onTitleChange }: NoteEntryEditorMainContentProps) => {
  const editorId = useId();

  return (
    <section className="min-h-0 min-w-0 overflow-y-auto px-5 py-6 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="border-b border-border pb-5">
          <p className="text-xs font-extrabold uppercase text-primary">New note</p>
          <AppInputText
            className="mt-3 border-0 px-0 text-3xl font-extrabold leading-tight shadow-none focus:ring-0"
            error={titleError}
            id="note-title"
            name="title"
            placeholder="Untitled note"
            value={title}
            onBlur={onTitleBlur}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              onTitleChange(getInputValue(event));
            }}
          />
        </div>

        <div className="mt-5 rounded-md border border-border bg-background">
          <div className="flex items-center gap-1 border-b border-border bg-muted/50 px-3 py-2">
            <button className={`rounded-md px-3 py-2 text-sm font-extrabold ${mode === 'edit' ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`} type="button" onClick={() => onModeChange('edit')}>
              Edit
            </button>
            <button className={`rounded-md px-3 py-2 text-sm font-extrabold ${mode === 'preview' ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`} type="button" onClick={() => onModeChange('preview')}>
              Preview
            </button>
          </div>

          {mode === 'edit' ? (
            <AppInputTextArea
              aria-label="Note body"
              className="h-full resize-none rounded-none border-0 font-mono text-sm leading-7 shadow-none focus:ring-0"
              error={bodyMarkdownError}
              id={editorId}
              name="bodyMarkdown"
              placeholder="# Start writing"
              value={bodyMarkdown}
              onBlur={onBodyMarkdownBlur}
              onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                onBodyMarkdownChange(getInputValue(event));
              }}
            />
          ) : (
            <div className="min-h-[32rem] space-y-6 px-5 py-6">{renderMarkdownPreview(bodyMarkdown)}</div>
          )}
        </div>
      </div>
    </section>
  );
};
