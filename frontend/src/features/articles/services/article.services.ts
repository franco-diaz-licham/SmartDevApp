import { apiClient } from '@/lib/api/apiClient';
import type { BaseQuery, PageResult } from '@/lib/api/api.types';
import type { CreateArticleRequestDto, CreateArticleResponseDto, PublicArticleDetailResponse, PublicArticleListItemResponse, PublicSearchIndexResponse, UpdateArticleRequestDto, UpdateArticleResponseDto } from '../types/article.api.types';

const ARTICLES_URL = '/articles';
const OWNER_ARTICLES_URL = '/owner/articles';

export const articleService = {
  getPublicArticles(request: BaseQuery = {}): Promise<PageResult<PublicArticleListItemResponse>> {
    return apiClient.getPage<PublicArticleListItemResponse, BaseQuery>(ARTICLES_URL, request);
  },

  getOwnerArticles(request: BaseQuery = {}): Promise<PageResult<PublicArticleListItemResponse>> {
    return apiClient.getPage<PublicArticleListItemResponse, BaseQuery>(OWNER_ARTICLES_URL, request);
  },

  getOwnerArticleById(articleId: string): Promise<PublicArticleDetailResponse> {
    return apiClient.getSingle<PublicArticleDetailResponse>(`${OWNER_ARTICLES_URL}/${encodeURIComponent(articleId)}`);
  },

  getPublicArticleById(articleId: string): Promise<PublicArticleDetailResponse> {
    return apiClient.getSingle<PublicArticleDetailResponse>(`${ARTICLES_URL}/${encodeURIComponent(articleId)}`);
  },

  getPublicArticleCategories(request: BaseQuery = {}): Promise<PageResult<string>> {
    return apiClient.getPage<string, BaseQuery>(`${ARTICLES_URL}/categories`, request);
  },

  getOwnerArticleCategories(request: BaseQuery = {}): Promise<PageResult<string>> {
    return apiClient.getPage<string, BaseQuery>(`${OWNER_ARTICLES_URL}/categories`, request);
  },

  getPublicArticleTags(request: BaseQuery = {}): Promise<PageResult<string>> {
    return apiClient.getPage<string, BaseQuery>(`${ARTICLES_URL}/tags`, request);
  },

  searchPublicArticles(request: BaseQuery = {}): Promise<PageResult<PublicArticleListItemResponse>> {
    return apiClient.getPage<PublicArticleListItemResponse, BaseQuery>(`${ARTICLES_URL}/search`, request);
  },

  getPublicArticleSearchIndex(): Promise<PublicSearchIndexResponse> {
    return apiClient.getSingle<PublicSearchIndexResponse>(`${ARTICLES_URL}/search-index`);
  },

  createArticle(request: CreateArticleRequestDto): Promise<CreateArticleResponseDto> {
    return apiClient.post<CreateArticleResponseDto>(OWNER_ARTICLES_URL, request);
  },

  updateArticle(articleId: string, request: UpdateArticleRequestDto): Promise<UpdateArticleResponseDto> {
    return apiClient.put<UpdateArticleResponseDto>(`${OWNER_ARTICLES_URL}/${encodeURIComponent(articleId)}`, request);
  }
};
