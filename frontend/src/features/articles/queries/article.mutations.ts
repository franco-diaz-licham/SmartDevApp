import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mapCreateArticleResponseDtoToModel, mapArticleEntryModelToCreateRequestDto, mapArticleEntryModelToUpdateRequestDto, mapUpdateArticleResponseDtoToModel } from '../mappers/article.mapper';
import type { ArticleEntryModel } from '../types/article.types';
import { articleKeys } from './article.queries';
import { articleService } from '../services/article.services';

/**
 * Creates an owner article and refreshes cached article lists after a successful save.
 *
 * @returns React Query mutation state for creating an article from editor values.
 */
export const useCreateArticleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (article: ArticleEntryModel) => mapCreateArticleResponseDtoToModel(await articleService.createArticle(mapArticleEntryModelToCreateRequestDto(article))),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: articleKeys.lists() });
    }
  });
};

/**
 * Updates an owner article and refreshes cached list/detail article queries after a
 * successful save.
 *
 * @param articleId - Existing article identifier to update.
 * @returns React Query mutation state for updating an article from editor values.
 */
export const useUpdateArticleMutation = (articleId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (article: ArticleEntryModel) => mapUpdateArticleResponseDtoToModel(await articleService.updateArticle(articleId, mapArticleEntryModelToUpdateRequestDto(article))),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: articleKeys.lists() });
      await queryClient.invalidateQueries({ queryKey: articleKeys.details() });
    }
  });
};
