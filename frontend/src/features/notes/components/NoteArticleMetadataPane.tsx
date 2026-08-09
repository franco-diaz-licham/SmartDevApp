import type { ChangeEvent } from 'react';
import UilPen from '@iconscout/react-unicons/icons/uil-pen';
import { AppButton } from '@/components/ui/AppButton';
import { AppInputText } from '@/components/ui/AppInputText';
import type { NoteEntryModel, PublicNoteDetailModel } from '../types/note.types';
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
  tagsError?: string;
  tagsValue?: string;
  onCancel?: () => void;
  onFieldBlur?: () => void;
  onFieldChange?: <TField extends keyof Pick<NoteEntryModel, 'category' | 'slug' | 'tags'>>(field: TField, value: NoteEntryModel[TField]) => void;
  onEditField?: (field: EditableNoteArticleField) => void;
}

const getInputValue = (event: ChangeEvent<HTMLInputElement>) => event.target.value;
const InlineEditIcon = () => <UilPen aria-hidden="true" className="ml-2 inline size-3.5 opacity-0 transition group-hover:opacity-70 group-focus:opacity-70" />;

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
  tagsError,
  tagsValue,
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
          <AppButton className="mb-0 mt-0 px-3 py-2 text-sm font-extrabold" type="submit" disabled={!isPageDirty || isSaving}>
            {isSaving ? 'Saving...' : 'Save'}
          </AppButton>
          <AppButton appearance="secondary" className="mb-0 mt-0 px-3 py-2 text-sm font-extrabold" type="button" disabled={!isPageDirty || isSaving} onClick={onCancel}>
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
      <dl className="mt-6 space-y-5 text-sm">
        <div>
          <dt className="font-extrabold text-foreground">Category</dt>
          <dd className="mt-1 text-muted-foreground">
            {isEditable && editingField === 'category' ? (
              <AppInputText
                autoFocus
                inline
                error={categoryError}
                name="category"
                value={categoryValue ?? note.category.displayName}
                onBlur={onFieldBlur}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  onFieldChange?.('category', getInputValue(event));
                }}
              />
            ) : (
              <AppButton inline className="block w-full p-1 text-muted-foreground leading-tight" type="button" disabled={!isEditable} onClick={() => onEditField?.('category')}>
                {categoryValue ?? note.category.displayName}
                {isEditable ? <InlineEditIcon /> : null}
              </AppButton>
            )}
          </dd>
        </div>

        <div>
          <dt className="font-extrabold text-foreground">Published</dt>
          <dd className="mt-1 text-muted-foreground">{formatNoteDate(note.publishedAt)}</dd>
        </div>

        <div>
          <dt className="font-extrabold text-foreground">Updated</dt>
          <dd className="mt-1 text-muted-foreground">{formatNoteDate(note.updatedAt)}</dd>
        </div>

        <div>
          <dt className="font-extrabold text-foreground">Slug</dt>
          <dd className="mt-1 break-all text-muted-foreground">
            {isEditable && editingField === 'slug' ? (
              <AppInputText
                autoFocus
                inline
                error={slugError}
                name="slug"
                value={slugValue ?? note.slug}
                onBlur={onFieldBlur}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  onFieldChange?.('slug', getInputValue(event));
                }}
              />
            ) : (
              <AppButton inline className="break-all p-1 text-muted-foreground" type="button" disabled={!isEditable} onClick={() => onEditField?.('slug')}>
                {slugValue ?? note.slug}
                {isEditable ? <InlineEditIcon /> : null}
              </AppButton>
            )}
          </dd>
        </div>

        <div>
          <dt className="font-extrabold text-foreground">Tags</dt>
          <dd className="mt-2">
            {isEditable && editingField === 'tags' ? (
              <AppInputText
                autoFocus
                inline
                error={tagsError}
                name="tags"
                value={tagsValue ?? note.tags.map((tag) => tag.displayName).join(', ')}
                onBlur={onFieldBlur}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  onFieldChange?.('tags', getInputValue(event));
                }}
              />
            ) : (
              <AppButton inline className="flex flex-wrap gap-2 p-1" type="button" disabled={!isEditable} onClick={() => onEditField?.('tags')}>
                {(tagsValue ?? note.tags.map((tag) => tag.displayName).join(', '))
                  .split(',')
                  .map((tag) => tag.trim())
                  .filter((tag) => tag.length > 0)
                  .map((tag) => (
                    <span key={tag} className="rounded bg-muted px-2 py-1 text-xs font-bold text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                {isEditable ? <InlineEditIcon /> : null}
              </AppButton>
            )}
          </dd>
        </div>

        {note.relatedProjects.length > 0 ? (
          <div>
            <dt className="font-extrabold text-foreground">Related projects</dt>
            <dd className="mt-2 space-y-2 text-muted-foreground">
              {note.relatedProjects.map((project) => (
                <span key={project.projectId} className="block">
                  {project.label}
                </span>
              ))}
            </dd>
          </div>
        ) : null}
      </dl>
    )}
  </aside>
);
