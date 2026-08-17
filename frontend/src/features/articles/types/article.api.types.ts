export type ArticleStatusDto = 'Draft' | 'Published' | 'Archived';

export type ArticleVisibilityDto = 'Private' | 'Public';

export interface PublicArticleCategoryResponse {
  slug: string;
  displayName: string;
}

export interface PublicArticleTagResponse {
  slug: string;
  displayName: string;
}

export interface PublicRelatedProjectReferenceResponse {
  projectId: string;
  label: string;
}

export interface PublicArticleListItemResponse {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: PublicArticleCategoryResponse;
  tags: PublicArticleTagResponse[];
  status: ArticleStatusDto;
  visibility: ArticleVisibilityDto;
  updatedAt: string | null;
  publishedAt: string;
}

export interface PublicArticleDetailResponse extends PublicArticleListItemResponse {
  bodyMarkdown: string;
  relatedProjects: PublicRelatedProjectReferenceResponse[];
}

export interface PublicArticleSearchDocumentResponse {
  id: string;
  type: 'article';
  slug: string;
  title: string;
  summary: string;
  category: string;
  tags: string[];
  bodyText: string;
  url: string;
  updatedAt: string | null;
  publishedAt: string | null;
}

export interface PublicSearchIndexResponse {
  generatedAt: string;
  documents: PublicArticleSearchDocumentResponse[];
}

export interface CreateArticleCategoryDto {
  slug: string;
  displayName: string;
}

export interface CreateArticleTagDto {
  slug: string;
  displayName: string;
}

export interface CreateArticleRequestDto {
  title: string;
  slug: string;
  summary: string;
  category: CreateArticleCategoryDto;
  tags: CreateArticleTagDto[];
  bodyMarkdown: string;
  status: ArticleStatusDto;
  visibility: ArticleVisibilityDto;
}

export interface CreateArticleResponseDto {
  articleId: string;
  slug: string;
}

export interface UpdateArticleRequestDto {
  title: string;
  slug: string;
  summary: string;
  category: CreateArticleCategoryDto;
  tags: CreateArticleTagDto[];
  bodyMarkdown: string;
  status: ArticleStatusDto;
  visibility: ArticleVisibilityDto;
}

export interface UpdateArticleResponseDto {
  articleId: string;
  slug: string;
}
