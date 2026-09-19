import { useCallback } from 'react';
import type { ArticleEntryModel, PublicArticleDetailModel } from '../types/article.types';

const isPublicPublished = (entry: Pick<ArticleEntryModel, 'status' | 'visibility'> | undefined) => entry?.status === 'Published' && entry.visibility === 'Public';

export const useArticleNarration = () => {
  const canShowAudioPlayer = useCallback((isEditable: boolean, article: PublicArticleDetailModel | undefined) => !isEditable && isPublicPublished(article), []);
  const getSavedMessage = useCallback(() => 'Saved.', []);

  return {
    canShowAudioPlayer,
    getSavedMessage
  };
};
