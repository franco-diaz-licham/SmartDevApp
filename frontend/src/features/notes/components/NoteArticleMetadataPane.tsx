import type { ChangeEvent } from 'react';
import { AppButton } from '@/components/ui/AppButton';
import { AppInputText } from '@/components/ui/AppInputText';
import { AppSelect } from '@/components/ui/AppSelect';
import type { NoteEntryModel, NoteStatusModel, NoteVisibilityModel, PublicNoteDetailModel } from '../types/note.types';
import { noteStatusOptions, noteVisibilityOptions } from '../types/noteEntryForm.schema';
import { formatNoteDate } from '../utils/noteContent';
import type { EditableNoteArticleField } from './NoteArticleContent';

interface NoteArticleMetadataPaneProps {
  categoryError?: string;
  categoryValue?: string;
  editingField?: EditableNoteArticleField;
  isEditable?: boolean;
  isSaving?: boolean;
  note: PublicNoteDetailModel | undefined;
  savedMessage?: string;
  errorMessage?: string;
  isDirty?: boolean;
  slugError?: string;
  slugValue?: string;
  statusError?: string;
  statusValue?: NoteStatusModel;
  tagsError?: string;
  tagsValue?: string;
  visibilityError?: string;
  visibilityValue?: NoteVisibilityModel;
  onCancel?: () => void;
  onFieldBlur?: () => void;
  onFieldChange?: <TField extends keyof Pick<NoteEntryModel, 'category' | 'slug' | 'status' | 'tags' | 'visibility'>>(field: TField, value: NoteEntryModel[TField]) => void;
  onEditField?: (field: EditableNoteArticleField) => void;
}

const getInputValue = (event: ChangeEvent<HTMLInputElement>) => event.target.value;
const statusSelectOptions = noteStatusOptions.map((status) => ({ label: status, value: status }));
const visibilitySelectOptions = noteVisibilityOptions.map((visibility) => ({ label: visibility, value: visibility }));

export const NoteArticleMetadataPane = ({
  categoryError,
  categoryValue,
  editingField,
  isDirty: isPageDirty = false,
  isEditable = false,
  isSaving = false,
  note,
  savedMessage,
  errorMessage,
  slugError,
  slugValue,
  statusError,
  statusValue,
  tagsError,
  tagsValue,
  visibilityError,
  visibilityValue,
  onCancel,
  onFieldBlur,
  onFieldChange,
  onEditField
}: NoteArticleMetadataPaneProps) => (
  <aside className="min-h-0 overflow-y-auto border-t border-border px-5 py-6 lg:border-l lg:border-t-0 xl:px-6">
    <div className="border-b border-border pb-4">
      <p className="text-xs font-extrabold uppercase text-primary">Metadata</p>
      <h2 className="mt-1 text-lg font-extrabold">Note details</h2>

      {isEditable ? (
        <div className="mt-4 flex gap-2">
          <AppButton className="mb-0 mt-0 px-3 py-2 text-sm font-extrabold w-1/2" type="submit" disabled={!isPageDirty || isSaving}>
            {isSaving ? 'Saving...' : 'Save'}
          </AppButton>
          <AppButton appearance="secondary" className="mb-0 mt-0 px-3 py-2 text-sm font-extrabold w-1/2" type="button" disabled={!isPageDirty || isSaving} onClick={onCancel}>
            Cancel
          </AppButton>
        </div>
      ) : null}
    </div>

    {savedMessage ? <p className="mt-4 rounded-md border border-success-border bg-success p-3 text-sm font-bold text-success-heading">{savedMessage}</p> : null}
    {errorMessage ? <p className="mt-4 rounded-md border border-error-border bg-error p-3 text-sm font-bold text-error-heading">{errorMessage}</p> : null}

    {!note ? (
      <p className="mt-6 rounded-md border border-border p-4 text-sm text-muted-foreground">Loading note details...</p>
    ) : (
      <div className="mt-6 space-y-5 text-sm">
        <AppSelect
          error={statusError}
          inline
          inlineStatus={isEditable ? 'edit' : 'read'}
          label="Status"
          name="status"
          options={statusSelectOptions}
          value={statusValue ?? note.status}
          onChange={(event: ChangeEvent<HTMLSelectElement>) => {
            onFieldChange?.('status', event.target.value as NoteStatusModel);
          }}
        />
        <AppSelect
          error={visibilityError}
          inline
          inlineStatus={isEditable ? 'edit' : 'read'}
          label="Visibility"
          name="visibility"
          options={visibilitySelectOptions}
          value={visibilityValue ?? note.visibility}
          onChange={(event: ChangeEvent<HTMLSelectElement>) => {
            onFieldChange?.('visibility', event.target.value as NoteVisibilityModel);
          }}
        />
        <AppInputText
          autoFocus={isEditable && editingField === 'category'}
          inline
          inlineStatus={isEditable && editingField === 'category' ? 'edit' : 'read'}
          className="px-2 py-1 pr-8 leading-tight"
          error={categoryError}
          label="Category"
          name="category"
          readValue={categoryValue ?? note.category.displayName}
          value={categoryValue ?? note.category.displayName}
          onBlur={onFieldBlur}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            onFieldChange?.('category', getInputValue(event));
          }}
          onInlineEdit={isEditable ? () => onEditField?.('category') : undefined}
        />
        <AppInputText
          autoFocus={isEditable && editingField === 'slug'}
          inline
          inlineStatus={isEditable && editingField === 'slug' ? 'edit' : 'read'}
          className="break-all px-2 py-1 pr-8"
          error={slugError}
          label="Slug"
          name="slug"
          readValue={slugValue ?? note.slug}
          value={slugValue ?? note.slug}
          onBlur={onFieldBlur}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            onFieldChange?.('slug', getInputValue(event));
          }}
          onInlineEdit={isEditable ? () => onEditField?.('slug') : undefined}
        />
        <AppInputText
          autoFocus={isEditable && editingField === 'tags'}
          inline
          inlineStatus={isEditable && editingField === 'tags' ? 'edit' : 'read'}
          className="flex flex-wrap gap-2 px-2 py-1 pr-8"
          error={tagsError}
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
          onBlur={onFieldBlur}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            onFieldChange?.('tags', getInputValue(event));
          }}
          onInlineEdit={isEditable ? () => onEditField?.('tags') : undefined}
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
