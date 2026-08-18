import type { ChangeEvent, FocusEvent } from 'react';
import { useRef } from 'react';
import { AppInlineEditSurface } from '@/components/ui/AppInlineEditSurface';
import { AppInputText } from '@/components/ui/AppInputText';
import { AppInputTextArea } from '@/components/ui/AppInputTextArea';
import { ArticleContentSkeleton } from './ArticleContentSkeleton';
import { ArticleMarkdown } from './ArticleMarkdown';
import type { ArticleEntryFormController } from '../hooks/useArticleEntryForm';
import type { PublicArticleDetailModel } from '../types/article.types';

interface ArticleContentProps {
  form?: ArticleEntryFormController;
  isEditable?: boolean;
  article: PublicArticleDetailModel | undefined;
  isLoading: boolean;
  isError: boolean;
}

const getInputValue = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => event.target.value;

export const ArticleContent = ({ form, isEditable = false, article, isLoading, isError }: ArticleContentProps) => {
  const bodyEditorRef = useRef<HTMLDivElement>(null);

  const titleValue = form?.values.title ?? article?.title;
  const summaryValue = form?.values.summary ?? article?.summary;
  const bodyMarkdownValue = form?.values.bodyMarkdown ?? article?.bodyMarkdown;

  const handleBodyEdit = () => {
    form?.editField('bodyMarkdown');
  };

  const handleBodyEditorBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (bodyEditorRef.current?.contains(event.relatedTarget)) return;
    form?.blurField();
  };

  return (
    <article className="min-w-0 px-5 py-7 sm:px-8 lg:min-h-0 lg:overflow-y-auto lg:px-10">
      {isLoading && <ArticleContentSkeleton />}
      {isError && <p className="rounded-md border border-error-border bg-error p-4 text-sm font-bold text-error-heading">Article could not be loaded.</p>}
      {article && (
        <div className="flex flex-col gap-3">
          <header id="overview" className="scroll-mt-28 border-b border-border pb-10 flex flex-col gap-3">
            <AppInputText
              autoFocus={isEditable && form?.editingField === 'title'}
              inline
              inlineSize="title"
              label="TITLE"
              inlineStatus={isEditable && form?.editingField === 'title' ? 'edit' : 'read'}
              className="mt-2 p-2 pr-8 text-3xl font-extrabold leading-tight"
              error={form?.errors.title}
              name="title"
              required={isEditable}
              readValue={titleValue}
              value={titleValue}
              onBlur={form?.blurField}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                form?.updateField('title', getInputValue(event));
              }}
              onInlineEdit={isEditable ? () => form?.editField('title') : undefined}
            />
            <AppInputTextArea
              autoFocus={isEditable && form?.editingField === 'summary'}
              inline
              inlineSize="summary"
              label="SUMMARY"
              inlineStatus={isEditable && form?.editingField === 'summary' ? 'edit' : 'read'}
              className="mt-5 p-2 pr-8 text-lg leading-8 text-muted-foreground"
              error={form?.errors.summary}
              name="summary"
              required={isEditable}
              readValue={summaryValue}
              value={summaryValue}
              onBlur={form?.blurField}
              onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                form?.updateField('summary', getInputValue(event));
              }}
              onInlineEdit={isEditable ? () => form?.editField('summary') : undefined}
            />
          </header>
          {isEditable && form?.editingField === 'bodyMarkdown' ? (
            <div ref={bodyEditorRef} onBlur={handleBodyEditorBlur}>
              <AppInputTextArea
                autoFocus
                aria-label="Article body"
                inline
                label="ARTICLE BODY"
                className="min-h-144 resize-none overflow-hidden font-mono text-sm leading-7 field-sizing-content"
                error={form?.errors.bodyMarkdown}
                name="bodyMarkdown"
                required={isEditable}
                value={bodyMarkdownValue}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                  form?.updateField('bodyMarkdown', getInputValue(event));
                }}
              />
            </div>
          ) : (
            <AppInlineEditSurface className="mt-3" disabled={!isEditable} label="ARTICLE BODY" required={isEditable} onEdit={handleBodyEdit}>
              <div className="space-y-6 pb-16">
                <ArticleMarkdown markdown={bodyMarkdownValue ?? ''} />
              </div>
            </AppInlineEditSurface>
          )}
        </div>
      )}
    </article>
  );
};
