import { useArticleAudio } from '../hooks/useArticleAudio';
import type { PublicArticleDetailModel } from '../types/article.types';

interface ArticleAudioPlayerProps {
  article: PublicArticleDetailModel;
}

export const ArticleAudioPlayer = ({ article }: ArticleAudioPlayerProps) => {
  const audio = useArticleAudio(article.id);

  if (audio.status === 'not-ready') {
    return <aside className="rounded-md border border-border bg-muted/30 p-4 text-sm text-muted-foreground">Audio narration is being generated and will appear here after the worker finishes.</aside>;
  }

  if (audio.status === 'error') {
    return <aside className="rounded-md border border-border bg-muted/30 p-4 text-sm text-muted-foreground">Audio narration is temporarily unavailable.</aside>;
  }

  return (
    <aside className="rounded-md border border-border bg-muted/30 p-4">
      <p className="mb-3 text-xs font-extrabold uppercase tracking-wide text-primary">Listen to this article</p>
      {audio.status === 'loading' || !audio.url ? (
        <p className="text-sm text-muted-foreground">Checking for audio narration...</p>
      ) : (
        <audio className="w-full" controls preload="metadata" src={audio.url}>
          <track kind="captions" />
          Audio playback is not supported by this browser.
        </audio>
      )}
    </aside>
  );
};
