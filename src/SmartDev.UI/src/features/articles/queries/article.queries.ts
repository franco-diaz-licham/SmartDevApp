import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import type { BaseQuery } from '@/lib/api/api.types';
import { mapPublicArticleDetailResponseToEntryModel, mapPublicArticleDetailResponseToModel, mapPublicArticleListItemResponseToModel, mapPublicSearchIndexResponseToModel } from '../mappers/article.mapper';
import { articleService } from '../services/article.services';

export const articleKeys = {
  all: ['articles'] as const,
  lists: () => [...articleKeys.all, 'list'] as const,
  publicList: (query: BaseQuery) => [...articleKeys.lists(), 'public', query] as const,
  ownerList: (query: BaseQuery) => [...articleKeys.lists(), 'owner', query] as const,
  details: () => [...articleKeys.all, 'detail'] as const,
  publicDetail: (articleId: string) => [...articleKeys.details(), 'public', articleId] as const,
  ownerDetail: (articleId: string) => [...articleKeys.details(), 'owner', articleId] as const,
  ownerEntry: (articleId: string) => [...articleKeys.details(), 'owner-entry', articleId] as const,
  publicCategories: (query: BaseQuery) => [...articleKeys.all, 'public-categories', query] as const,
  ownerCategories: (query: BaseQuery) => [...articleKeys.all, 'owner-categories', query] as const,
  publicTags: (query: BaseQuery) => [...articleKeys.all, 'public-tags', query] as const,
  publicSearch: (query: BaseQuery) => [...articleKeys.all, 'public-search', query] as const,
  publicSearchIndex: () => [...articleKeys.all, 'public-search-index'] as const
};

/**
 * Loads the public articles feed as an infinite query.
 *
 * @param query - Optional filters, search terms, sorting, and page sizing.
 * @param enabled - Set to false when the current route or auth mode should not
 * issue a public feed request.
 * @returns React Query infinite-query state for mapped public article list pages.
 */
export const usePublicArticlesQuery = (query: BaseQuery = {}, enabled = true) => {
  const initialQuery = {
    pageSize: 20,
    ...query
  };

  return useInfiniteQuery({
    queryKey: articleKeys.publicList(initialQuery),
    queryFn: async ({ pageParam }) => {
      const page = await articleService.getPublicArticles({
        ...initialQuery,
        continuationToken: pageParam
      });

      return {
        ...page,
        items: page.items.map(mapPublicArticleListItemResponseToModel)
      };
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.continuationToken,
    enabled
  });
};

/**
 * Loads the signed-in owner's articles feed as an infinite query.
 *
 * @param query - Optional filters, search terms, sorting, and page sizing.
 * @param enabled - Set to false when public preview mode is active or auth is
 * not ready.
 * @returns React Query infinite-query state for mapped owner article list pages.
 */
export const useOwnerArticlesQuery = (query: BaseQuery = {}, enabled = true) => {
  const initialQuery = {
    pageSize: 20,
    ...query
  };

  return useInfiniteQuery({
    queryKey: articleKeys.ownerList(initialQuery),
    queryFn: async ({ pageParam }) => {
      const page = await articleService.getOwnerArticles({
        ...initialQuery,
        continuationToken: pageParam
      });

      return {
        ...page,
        items: page.items.map(mapPublicArticleListItemResponseToModel)
      };
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.continuationToken,
    enabled
  });
};

/**
 * Searches public articles when a non-empty search term is present.
 *
 * @param query - Public article query values that include the search term.
 * @returns React Query state for mapped public article search results.
 */
export const usePublicArticleSearchQuery = (query: BaseQuery) =>
  useQuery({
    queryKey: articleKeys.publicSearch(query),
    queryFn: async () => {
      const page = await articleService.searchPublicArticles(query);
      return {
        ...page,
        items: page.items.map(mapPublicArticleListItemResponseToModel)
      };
    },
    enabled: Boolean(query.searchTerm?.trim())
  });

/**
 * Loads one public article detail by id.
 *
 * @param articleId - Article identifier from the route.
 * @param enabled - Set to false when owner mode is active or auth is not ready.
 * @returns React Query state for the mapped public article detail.
 */
export const usePublicArticleQuery = (articleId: string, enabled = true) =>
  useQuery({
    queryKey: articleKeys.publicDetail(articleId),
    queryFn: async () => mapPublicArticleDetailResponseToModel(await articleService.getPublicArticleById(articleId)),
    enabled: enabled && articleId.trim().length > 0
  });

/**
 * Loads one owner article detail in editable entry form shape.
 *
 * @param articleId - Article identifier from the route.
 * @returns React Query state for the mapped editable article entry.
 */
export const useOwnerArticleEntryQuery = (articleId: string) =>
  useQuery({
    queryKey: articleKeys.ownerEntry(articleId),
    queryFn: async () => mapPublicArticleDetailResponseToEntryModel(await articleService.getOwnerArticleById(articleId)),
    enabled: articleId.trim().length > 0
  });

/**
 * Loads one owner article detail by id.
 *
 * @param articleId - Article identifier from the route.
 * @param enabled - Set to false when public preview mode is active or auth is
 * not ready.
 * @returns React Query state for the mapped owner article detail.
 */
export const useOwnerArticleQuery = (articleId: string, enabled = true) =>
  useQuery({
    queryKey: articleKeys.ownerDetail(articleId),
    queryFn: async () => mapPublicArticleDetailResponseToModel(await articleService.getOwnerArticleById(articleId)),
    enabled: enabled && articleId.trim().length > 0
  });

/**
 * Loads public article categories used by article navigation and filters.
 *
 * @param query - Optional paging or filtering values for category results.
 * @returns React Query state for public article categories.
 */
export const usePublicArticleCategoriesQuery = (query: BaseQuery = {}, enabled = true) =>
  useQuery({
    queryKey: articleKeys.publicCategories(query),
    queryFn: () => articleService.getPublicArticleCategories(query),
    enabled
  });

/**
 * Loads owner article categories used by article navigation and filters.
 *
 * @param query - Optional paging or filtering values for category results.
 * @param enabled - Set to false when public preview mode is active or auth is
 * not ready.
 * @returns React Query state for owner article categories.
 */
export const useOwnerArticleCategoriesQuery = (query: BaseQuery = {}, enabled = true) =>
  useQuery({
    queryKey: articleKeys.ownerCategories(query),
    queryFn: () => articleService.getOwnerArticleCategories(query),
    enabled
  });

/**
 * Loads public article tags used by article navigation and filters.
 *
 * @param query - Optional paging or filtering values for tag results.
 * @returns React Query state for public article tags.
 */
export const usePublicArticleTagsQuery = (query: BaseQuery = {}) =>
  useQuery({
    queryKey: articleKeys.publicTags(query),
    queryFn: () => articleService.getPublicArticleTags(query)
  });

/**
 * Loads the public search index used for fast client-side article discovery.
 *
 * @returns React Query state for the mapped public article search index.
 */
export const usePublicArticleSearchIndexQuery = () =>
  useQuery({
    queryKey: articleKeys.publicSearchIndex(),
    queryFn: async () => mapPublicSearchIndexResponseToModel(await articleService.getPublicArticleSearchIndex())
  });
