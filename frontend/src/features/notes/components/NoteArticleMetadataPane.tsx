import type { FieldError, UseFormRegisterReturn } from 'react-hook-form';
import { AppInputText } from '@/components/ui/AppInputText';
import type { PublicNoteDetailModel } from '../types/note.types';
import { formatNoteDate } from '../utils/noteContent';
import type { EditableNoteArticleField } from './NoteArticleContent';

interface NoteArticleMetadataPaneProps {
  categoryField?: UseFormRegisterReturn;
  categoryError?: FieldError;
  editingField?: EditableNoteArticleField;
  isDirty?: boolean;
  isEditable?: boolean;
  isSaving?: boolean;
  note: PublicNoteDetailModel | undefined;
  savedMessage?: string;
  errorMessage?: string;
  slugField?: UseFormRegisterReturn;
  slugError?: FieldError;
  tagsField?: UseFormRegisterReturn;
  tagsError?: FieldError;
  onCancel?: () => void;
  onEditField?: (field: EditableNoteArticleField) => void;
}

export const NoteArticleMetadataPane = ({ categoryField, categoryError, editingField, isDirty = false, isEditable = false, isSaving = false, note, savedMessage, errorMessage, slugField, slugError, tagsField, tagsError, onCancel, onEditField }: NoteArticleMetadataPaneProps) => (
  <aside className="min-h-0 overflow-y-auto border-b border-border px-5 py-6 lg:border-b-0 lg:border-r xl:px-6">
    <div className="border-b border-border pb-4">
      <p className="text-xs font-extrabold uppercase text-primary">Metadata</p>
      <h2 className="mt-1 text-lg font-extrabold">Note details</h2>

      {isEditable ? (
        <div className="mt-4 flex gap-2">
          <button className="rounded-md bg-primary px-3 py-2 text-sm font-extrabold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={!isDirty || isSaving}>
            {isSaving ? 'Saving...' : 'Save'}
          </button>
          <button className="rounded-md border border-border px-3 py-2 text-sm font-extrabold disabled:cursor-not-allowed disabled:opacity-60" type="button" disabled={!isDirty || isSaving} onClick={onCancel}>
            Cancel
          </button>
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
            {isEditable && editingField === 'category' && categoryField ? (
              <AppInputText {...categoryField} autoFocus error={categoryError?.message} />
            ) : (
              <button className="bg-transparent p-0 text-left text-muted-foreground" type="button" disabled={!isEditable} onClick={() => onEditField?.('category')}>
                {note.category.displayName}
              </button>
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
            {isEditable && editingField === 'slug' && slugField ? (
              <AppInputText {...slugField} autoFocus error={slugError?.message} />
            ) : (
              <button className="break-all bg-transparent p-0 text-left text-muted-foreground" type="button" disabled={!isEditable} onClick={() => onEditField?.('slug')}>
                {note.slug}
              </button>
            )}
          </dd>
        </div>

        <div>
          <dt className="font-extrabold text-foreground">Tags</dt>
          <dd className="mt-2">
            {isEditable && editingField === 'tags' && tagsField ? (
              <AppInputText {...tagsField} autoFocus error={tagsError?.message} />
            ) : (
              <button className="flex flex-wrap gap-2 bg-transparent p-0 text-left" type="button" disabled={!isEditable} onClick={() => onEditField?.('tags')}>
                {note.tags.map((tag) => (
                  <span key={tag.slug} className="rounded bg-muted px-2 py-1 text-xs font-bold text-muted-foreground">
                    {tag.displayName}
                  </span>
                ))}
              </button>
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
