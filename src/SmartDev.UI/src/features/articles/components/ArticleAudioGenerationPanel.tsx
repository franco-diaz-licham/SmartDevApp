import { AppButton } from '@/components/ui/AppButton';

interface ArticleAudioGenerationPanelProps {
  isGeneratingAudio: boolean;
  message?: string;
  onGenerateAudio?: () => void;
}

export const ArticleAudioGenerationPanel = ({ isGeneratingAudio, message, onGenerateAudio }: ArticleAudioGenerationPanelProps) => (
  <aside className="rounded-md border border-border bg-muted/30 p-4">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs font-extrabold uppercase tracking-wide text-primary">Audio narration</p>
        <p className="mt-1 text-sm text-muted-foreground">Generate the downloadable public audio for the saved article content.</p>
        {message && <p className="mt-2 text-sm text-muted-foreground">{message}</p>}
      </div>
      <AppButton className="mb-0 mt-0 text-sm" type="button" disabled={isGeneratingAudio} onClick={onGenerateAudio}>
        {isGeneratingAudio ? 'Generating...' : 'Generate audio'}
      </AppButton>
    </div>
  </aside>
);
