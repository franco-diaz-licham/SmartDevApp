import type { ChangeEvent } from 'react';
import { AppButton } from '@/components/ui/AppButton';
import { AppInputText } from '@/components/ui/AppInputText';
import { AppSelect } from '@/components/ui/AppSelect';
import type { NoteEntryFormController } from '../hooks/useNoteEntryForm';
import type { NoteStatusModel, NoteVisibilityModel, PublicNoteDetailModel } from '../types/note.types';
import { noteStatusOptions, noteVisibilityOptions } from '../types/noteEntryForm.schema';
import { formatNoteDate } from '../utils/noteContent';

interface NoteArticleMetadataPaneProps {
  form?: NoteEntryFormController;
  isEditable?: boolean;
  note: PublicNoteDetailModel | undefined;
}

const getInputValue = (event: ChangeEvent<HTMLInputElement>) => event.target.value;
const statusSelectOptions = noteStatusOptions.map((status) => ({ label: status, value: status }));
const visibilitySelectOptions = noteVisibilityOptions.map((visibility) => ({ label: visibility, value: visibility }));

export const NoteArticleMetadataPane = ({
  form,
  isEditable = false,
  note
}: NoteArticleMetadataPaneProps) => {
  const categoryValue = form?.values.category;
  const editingField = form?.editingField;
  const slugValue = form?.values.slug;
  const statusValue = form?.values.status;
  const tagsValue = form?.values.tags;
  const visibilityValue = form?.values.visibility;

  return (
  <aside className="min-h-0 overflow-y-auto border-t border-border px-5 py-6 lg:border-l lg:border-t-0 xl:px-6">
    <div className="border-b border-border pb-4">
      <p className="text-xs font-extrabold uppercase text-primary">Metadata</p>
      <h2 className="mt-1 text-lg font-extrabold">Note details</h2>

      {isEditable ? (
        <div className="mt-4 flex gap-2">
          <AppButton className="mb-0 mt-0 px-3 py-2 text-sm font-extrabold w-1/2" type="submit" disabled={!form?.isDirty || form.isSaving}>
            {form?.isSaving ? 'Saving...' : 'Save'}
          </AppButton>
          <AppButton appearance="secondary" className="mb-0 mt-0 px-3 py-2 text-sm font-extrabold w-1/2" type="button" disabled={!form?.isDirty || form.isSaving} onClick={form?.cancel}>
            Cancel
          </AppButton>
        </div>
      ) : null}
    </div>

    {form?.savedMessage ? <p className="mt-4 rounded-md border border-success-border bg-success p-3 text-sm font-bold text-success-heading">{form.savedMessage}</p> : null}
    {form?.errorMessage ? <p className="mt-4 rounded-md border border-error-border bg-error p-3 text-sm font-bold text-error-heading">{form.errorMessage}</p> : null}

    {!note ? (
      <p className="mt-6 rounded-md border border-border p-4 text-sm text-muted-foreground">Loading note details...</p>
    ) : (
      <div className="mt-6 space-y-5 text-sm">
        <AppSelect
          error={form?.errors.status}
          inline
          inlineStatus={isEditable ? 'edit' : 'read'}
          label="Status"
          name="status"
          options={statusSelectOptions}
          value={statusValue ?? note.status}
          onChange={(event: ChangeEvent<HTMLSelectElement>) => {
            form?.updateField('status', event.target.value as NoteStatusModel);
          }}
        />
        <AppSelect
          error={form?.errors.visibility}
          inline
          inlineStatus={isEditable ? 'edit' : 'read'}
          label="Visibility"
          name="visibility"
          options={visibilitySelectOptions}
          value={visibilityValue ?? note.visibility}
          onChange={(event: ChangeEvent<HTMLSelectElement>) => {
            form?.updateField('visibility', event.target.value as NoteVisibilityModel);
          }}
        />
        <AppInputText
          autoFocus={isEditable && editingField === 'category'}
          inline
          inlineStatus={isEditable && editingField === 'category' ? 'edit' : 'read'}
          className="px-2 py-1 pr-8 leading-tight"
          error={form?.errors.category}
          label="Category"
          name="category"
          readValue={categoryValue ?? note.category.displayName}
          value={categoryValue ?? note.category.displayName}
          onBlur={form?.blurField}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            form?.updateField('category', getInputValue(event));
          }}
          onInlineEdit={isEditable ? () => form?.editField('category') : undefined}
        />
        <AppInputText
          autoFocus={isEditable && editingField === 'slug'}
          inline
          inlineStatus={isEditable && editingField === 'slug' ? 'edit' : 'read'}
          className="break-all px-2 py-1 pr-8"
          error={form?.errors.slug}
          label="Slug"
          name="slug"
          readValue={slugValue ?? note.slug}
          value={slugValue ?? note.slug}
          onBlur={form?.blurField}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            form?.updateField('slug', getInputValue(event));
          }}
          onInlineEdit={isEditable ? () => form?.editField('slug') : undefined}
        />
        <AppInputText
          autoFocus={isEditable && editingField === 'tags'}
          inline
          inlineStatus={isEditable && editingField === 'tags' ? 'edit' : 'read'}
          className="flex flex-wrap gap-2 px-2 py-1 pr-8"
          error={form?.errors.tags}
          label="Tags"
          name="tags"
          readValue={(tagsValue ?? note.tags.map((tag) => tag.displayName).join(', '))
            .split(',')
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0)
            .map((tag) => (
              <span key={tag} className="rounded bg-muted px-2 py-1 text-xs font-bold text-muted-foreground">
                {tag}
              </span>
            ))}
          value={tagsValue ?? note.tags.map((tag) => tag.displayName).join(', ')}
          onBlur={form?.blurField}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            form?.updateField('tags', getInputValue(event));
          }}
          onInlineEdit={isEditable ? () => form?.editField('tags') : undefined}
        />

        <div>
          <p className="font-extrabold text-foreground">Published</p>
          <p className="mt-1 text-muted-foreground">{formatNoteDate(note.publishedAt)}</p>
        </div>

        <div>
          <p className="font-extrabold text-foreground">Updated</p>
          <p className="mt-1 text-muted-foreground">{formatNoteDate(note.updatedAt)}</p>
        </div>

        {note.relatedProjects.length > 0 ? (
          <div>
            <p className="font-extrabold text-foreground">Related projects</p>
            <div className="mt-2 space-y-2 text-muted-foreground">
              {note.relatedProjects.map((project) => (
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
