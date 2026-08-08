import type { FieldError, UseFormRegisterReturn } from 'react-hook-form';
import { AppInputText } from '@/components/ui/AppInputText';
import { AppInputTextArea } from '@/components/ui/AppInputTextArea';

interface NoteEntryMetadataPanelProps {
  categoryError?: FieldError;
  categoryField: UseFormRegisterReturn;
  errorMessage?: string;
  isSaving: boolean;
  savedMessage?: string;
  slugError?: FieldError;
  slugField: UseFormRegisterReturn;
  summaryError?: FieldError;
  summaryField: UseFormRegisterReturn;
  tagsError?: FieldError;
  tagsField: UseFormRegisterReturn;
}

export const NoteEntryMetadataPanel = ({ categoryError, categoryField, errorMessage, isSaving, savedMessage, slugError, slugField, summaryError, summaryField, tagsError, tagsField }: NoteEntryMetadataPanelProps) => (
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
      <AppInputText {...slugField} error={slugError?.message} label="Slug" placeholder="azure-functions-notes" />
      <AppInputText {...categoryField} error={categoryError?.message} label="Category" placeholder="Backend" />
      <AppInputText {...tagsField} error={tagsError?.message} label="Tags" placeholder="dotnet, azure-functions" />
      <AppInputTextArea {...summaryField} className="min-h-36" error={summaryError?.message} label="Summary" placeholder="Short article summary" />

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
