import { useEffect, useState } from 'react';
import { getErrorStatusCode } from '@/lib/api/apiError';
import { articleService } from '../services/article.services';

export type ArticleAudioStatus = 'loading' | 'ready' | 'not-ready' | 'error';

interface ArticleAudioState {
  articleId: string;
  status: ArticleAudioStatus;
  url?: string;
}

const getAudioStatusFromError = (error: unknown): ArticleAudioStatus => (getErrorStatusCode(error) === 404 ? 'not-ready' : 'error');

const createArticleAudioState = async (articleId: string): Promise<ArticleAudioState> => {
  try {
    const audioBlob = await articleService.getPublicArticleAudio(articleId);
    return { articleId, status: 'ready', url: URL.createObjectURL(audioBlob) };
  } catch (error) {
    return { articleId, status: getAudioStatusFromError(error) };
  }
};

export const useArticleAudio = (articleId: string): ArticleAudioState => {
  const [audio, setAudio] = useState<ArticleAudioState>({ articleId, status: 'loading' });

  useEffect(() => {
    let objectUrl: string | undefined;

    void createArticleAudioState(articleId).then((nextAudio) => {
      objectUrl = nextAudio.url;
      setAudio(nextAudio);
    });

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [articleId]);

  return audio.articleId === articleId ? audio : { articleId, status: 'loading' };
};