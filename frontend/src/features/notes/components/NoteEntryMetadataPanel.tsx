import { AppInputText } from '@/components/ui/AppInputText';
import { AppInputTextArea } from '@/components/ui/AppInputTextArea';

type TextInputChangeEvent = {
  target: {
    value: string;
  };
};

interface NoteEntryMetadataPanelProps {
  category: string;
  errorMessage?: string;
  isSaving: boolean;
  savedMessage?: string;
  slug: string;
  summary: string;
  tags: string;
  onCategoryChange: (category: string) => void;
  onSave: () => void;
  onSlugChange: (slug: string) => void;
  onSummaryChange: (summary: string) => void;
  onTagsChange: (tags: string) => void;
}

export const NoteEntryMetadataPanel = ({ category, errorMessage, isSaving, savedMessage, slug, summary, tags, onCategoryChange, onSave, onSlugChange, onSummaryChange, onTagsChange }: NoteEntryMetadataPanelProps) => (
  <aside className="min-h-0 overflow-y-auto border-t border-border px-5 py-6 lg:border-l lg:border-t-0 xl:px-6">
    <div className="flex items-center justify-between border-b border-border pb-4">
      <div>
        <p className="text-xs font-extrabold uppercase text-primary">Metadata</p>
        <h2 className="mt-1 text-lg font-extrabold">Note details</h2>
      </div>
      <button className="rounded-md bg-primary px-4 py-2 text-sm font-extrabold text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60" type="button" disabled={isSaving} onClick={onSave}>
        {isSaving ? 'Saving...' : 'Save draft'}
      </button>
    </div>

    {savedMessage ? <p className="mt-4 rounded-md border border-success-border bg-success p-3 text-sm font-bold text-success-heading">{savedMessage}</p> : null}
    {errorMessage ? <p className="mt-4 rounded-md border border-error-border bg-error p-3 text-sm font-bold text-error-heading">{errorMessage}</p> : null}

    <div className="mt-6 space-y-5">
      <AppInputText label="Slug" value={slug} placeholder="azure-functions-notes" onChange={(event: TextInputChangeEvent) => onSlugChange(event.target.value)} />
      <AppInputText label="Category" value={category} placeholder="Backend" onChange={(event: TextInputChangeEvent) => onCategoryChange(event.target.value)} />
      <AppInputText label="Tags" value={tags} placeholder="dotnet, azure-functions" onChange={(event: TextInputChangeEvent) => onTagsChange(event.target.value)} />
      <AppInputTextArea className="min-h-36" label="Summary" value={summary} placeholder="Short article summary" onChange={(event: TextInputChangeEvent) => onSummaryChange(event.target.value)} />

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
