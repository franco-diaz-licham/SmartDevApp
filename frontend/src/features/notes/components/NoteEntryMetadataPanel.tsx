import type { ChangeEvent } from 'react';
import { AppInputText } from '@/components/ui/AppInputText';
import { AppInputTextArea } from '@/components/ui/AppInputTextArea';
import type { NoteEntryModel } from '../types/note.types';

interface NoteEntryMetadataPanelProps {
  categoryError?: string;
  errorMessage?: string;
  isSaving: boolean;
  note: Pick<NoteEntryModel, 'category' | 'slug' | 'summary' | 'tags'>;
  savedMessage?: string;
  slugError?: string;
  summaryError?: string;
  tagsError?: string;
  onFieldBlur: (field: keyof Pick<NoteEntryModel, 'category' | 'slug' | 'summary' | 'tags'>) => void;
  onFieldChange: <TField extends keyof Pick<NoteEntryModel, 'category' | 'slug' | 'summary' | 'tags'>>(field: TField, value: NoteEntryModel[TField]) => void;
}

const getInputValue = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => event.target.value;

export const NoteEntryMetadataPanel = ({ categoryError, errorMessage, isSaving, note, savedMessage, slugError, summaryError, tagsError, onFieldBlur, onFieldChange }: NoteEntryMetadataPanelProps) => (
  <aside className="min-h-0 overflow-y-auto border-t border-border px-5 py-6 lg:border-l lg:border-t-0 xl:px-6">
    <div className="flex items-center justify-between border-b border-border pb-4">
      <div>
        <p className="text-xs font-extrabold uppercase text-primary">Metadata</p>
        <h2 className="mt-1 text-lg font-extrabold">Note details</h2>
      </div>
      <button className="rounded-md bg-primary px-4 py-2 text-sm font-extrabold text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Save draft'}
      </button>
    </div>

    {savedMessage ? <p className="mt-4 rounded-md border border-success-border bg-success p-3 text-sm font-bold text-success-heading">{savedMessage}</p> : null}
    {errorMessage ? <p className="mt-4 rounded-md border border-error-border bg-error p-3 text-sm font-bold text-error-heading">{errorMessage}</p> : null}

    <div className="mt-6 space-y-5">
      <AppInputText
        error={slugError}
        label="Slug"
        name="slug"
        placeholder="azure-functions-notes"
        value={note.slug}
        onBlur={() => onFieldBlur('slug')}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          onFieldChange('slug', getInputValue(event));
        }}
      />
      <AppInputText
        error={categoryError}
        label="Category"
        name="category"
        placeholder="Backend"
        value={note.category}
        onBlur={() => onFieldBlur('category')}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          onFieldChange('category', getInputValue(event));
        }}
      />
      <AppInputText
        error={tagsError}
        label="Tags"
        name="tags"
        placeholder="dotnet, azure-functions"
        value={note.tags}
        onBlur={() => onFieldBlur('tags')}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          onFieldChange('tags', getInputValue(event));
        }}
      />
      <AppInputTextArea
        className="min-h-36"
        error={summaryError}
        label="Summary"
        name="summary"
        placeholder="Short article summary"
        value={note.summary}
        onBlur={() => onFieldBlur('summary')}
        onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
          onFieldChange('summary', getInputValue(event));
        }}
      />

      <div className="rounded-md border border-border bg-muted/40 p-4">
        <p className="text-sm font-extrabold">Publishing</p>
        <div className="mt-3 grid gap-3 text-sm text-muted-foreground">
          <label className="flex items-center gap-2">
            <input className="size-4 accent-primary" type="checkbox" disabled />
            Public
          </label>
          <label className="flex items-center gap-2">
            <input className="size-4 accent-primary" type="checkbox" disabled />
            Published
          </label>
        </div>
      </div>
    </div>
  </aside>
);
