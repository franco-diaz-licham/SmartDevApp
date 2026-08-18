import type { ChangeEvent } from 'react';
import { AppButton } from '@/components/ui/AppButton';
import { AppInputText } from '@/components/ui/AppInputText';
import { AppSelect } from '@/components/ui/AppSelect';
import { AuthenticatedOnly } from '@/features/auth';
import type { ArticleEntryFormController } from '../hooks/useArticleEntryForm';
import type { ArticleStatusModel, ArticleVisibilityModel, PublicArticleDetailModel } from '../types/article.types';
import { articleStatusOptions, articleVisibilityOptions } from '../types/articleEntryForm.schema';
import { formatArticleDate } from '../utils/articleContent';

interface ArticleMetadataPaneProps {
  form?: ArticleEntryFormController;
  isEditable?: boolean;
  article: PublicArticleDetailModel | undefined;
}

const getInputValue = (event: ChangeEvent<HTMLInputElement>) => event.target.value;
const statusSelectOptions = articleStatusOptions.map((status) => ({ label: status, value: status }));
const visibilitySelectOptions = articleVisibilityOptions.map((visibility) => ({ label: visibility, value: visibility }));

export const ArticleMetadataPane = ({ form, isEditable = false, article }: ArticleMetadataPaneProps) => {
  const tagNames = form?.values.tags ?? article?.tags.map((tag) => tag.displayName).join(', ') ?? '';
  const tagBadges = tagNames
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0)
    .map((tag) => (
      <span key={tag} className="rounded bg-muted px-2 py-1 text-xs font-bold text-muted-foreground">
        {tag}
      </span>
    ));

  return (
    <aside className="min-h-0 overflow-y-auto border-t border-border px-5 py-6 lg:border-l lg:border-t-0 xl:px-6">
      <div className="border-b border-border pb-4">
        <h2 className="text-lg font-extrabold">Details</h2>
        <AuthenticatedOnly when={isEditable && Boolean(form)}>
          <div className="mt-4 flex gap-2">
            <AppButton className="mb-0 mt-0 px-3 py-2 text-sm font-extrabold w-1/2" type="submit" disabled={!form?.isDirty || form.isSaving}>
              {form?.isSaving ? 'Saving...' : 'Save'}
            </AppButton>
            <AppButton appearance="secondary" className="mb-0 mt-0 px-3 py-2 text-sm font-extrabold w-1/2" type="button" disabled={!form?.isDirty || form.isSaving} onClick={form?.cancel}>
              Cancel
            </AppButton>
          </div>
        </AuthenticatedOnly>
      </div>

      {form?.savedMessage ? <p className="mt-4 rounded-md border border-success-border bg-success p-3 text-sm font-bold text-success-heading">{form.savedMessage}</p> : null}
      {form?.errorMessage ? <p className="mt-4 rounded-md border border-error-border bg-error p-3 text-sm font-bold text-error-heading">{form.errorMessage}</p> : null}
      {!article ? (
        <p className="mt-6 rounded-md border border-border p-4 text-sm text-muted-foreground">Loading article details...</p>
      ) : (
        <div className="mt-6 space-y-5 text-sm">
          <AuthenticatedOnly>
            <AppSelect
              error={form?.errors.status}
              inline
              inlineStatus={isEditable ? 'edit' : 'read'}
              label="Status"
              name="status"
              options={statusSelectOptions}
              required={isEditable}
              value={form?.values.status ?? article.status}
              onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                form?.updateField('status', event.target.value as ArticleStatusModel);
              }}
            />
            <AppSelect
              error={form?.errors.visibility}
              inline
              inlineStatus={isEditable ? 'edit' : 'read'}
              label="Visibility"
              name="visibility"
              options={visibilitySelectOptions}
              required={isEditable}
              value={form?.values.visibility ?? article.visibility}
              onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                form?.updateField('visibility', event.target.value as ArticleVisibilityModel);
              }}
            />
          </AuthenticatedOnly>
          <AppInputText
            autoFocus={isEditable && form?.editingField === 'category'}
            inline
            inlineStatus={isEditable && form?.editingField === 'category' ? 'edit' : 'read'}
            className="px-2 py-1 pr-8 leading-tight"
            error={form?.errors.category}
            label="Category"
            name="category"
            required={isEditable}
            readValue={form?.values.category ?? article.category.displayName}
            value={form?.values.category ?? article.category.displayName}
            onBlur={form?.blurField}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              form?.updateField('category', getInputValue(event));
            }}
            onInlineEdit={isEditable ? () => form?.editField('category') : undefined}
          />
          <AppInputText
            autoFocus={isEditable && form?.editingField === 'slug'}
            inline
            inlineStatus={isEditable && form?.editingField === 'slug' ? 'edit' : 'read'}
            className="break-all px-2 py-1 pr-8"
            error={form?.errors.slug}
            label="Slug"
            name="slug"
            required={isEditable}
            readValue={form?.values.slug ?? article.slug}
            value={form?.values.slug ?? article.slug}
            onBlur={form?.blurField}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              form?.updateField('slug', getInputValue(event));
            }}
            onInlineEdit={isEditable ? () => form?.editField('slug') : undefined}
          />
          <AppInputText
            autoFocus={isEditable && form?.editingField === 'tags'}
            inline
            inlineStatus={isEditable && form?.editingField === 'tags' ? 'edit' : 'read'}
            className="flex flex-wrap gap-2 px-2 py-1 pr-8"
            error={form?.errors.tags}
            label="Tags"
            name="tags"
            required={isEditable}
            readValue={tagBadges}
            value={tagNames}
            onBlur={form?.blurField}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              form?.updateField('tags', getInputValue(event));
            }}
            onInlineEdit={isEditable ? () => form?.editField('tags') : undefined}
          />

          <div>
            <p className="font-extrabold text-foreground">Published</p>
            <p className="mt-1 text-muted-foreground">{formatArticleDate(article.publishedAt)}</p>
          </div>

          <div>
            <p className="font-extrabold text-foreground">Updated</p>
            <p className="mt-1 text-muted-foreground">{formatArticleDate(article.updatedAt)}</p>
          </div>

          {article.relatedProjects.length > 0 ? (
            <div>
              <p className="font-extrabold text-foreground">Related projects</p>
              <div className="mt-2 space-y-2 text-muted-foreground">
                {article.relatedProjects.map((project) => (
                  <span key={project.projectId} className="block">
                    {project.label}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </aside>
  );
};
