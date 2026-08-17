import type {
  PublicArticleCategoryResponse,
  PublicArticleDetailResponse,
  PublicArticleListItemResponse,
  PublicArticleSearchDocumentResponse,
  PublicArticleTagResponse,
  PublicRelatedProjectReferenceResponse,
  PublicSearchIndexResponse
} from '../types/article.api.types';
import type {
  ArticleEntryModel,
  ArticleSaveResultModel,
  PublicArticleCategoryModel,
  PublicArticleDetailModel,
  PublicArticleListItemModel,
  PublicArticleSearchDocumentModel,
  PublicArticleTagModel,
  PublicRelatedProjectReferenceModel,
  PublicSearchIndexModel
} from '../types/article.types';
import type { CreateArticleCategoryDto, CreateArticleRequestDto, CreateArticleResponseDto, CreateArticleTagDto, UpdateArticleRequestDto, UpdateArticleResponseDto } from '../types/article.api.types';

const toNullableDate = (value: string | null): Date | null => (value ? new Date(value) : null);

const toSlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const toCreateArticleCategoryDto = (displayName: string): CreateArticleCategoryDto => ({
  slug: toSlug(displayName),
  displayName: displayName.trim()
});

const toCreateArticleTagDto = (displayName: string): CreateArticleTagDto => ({
  slug: toSlug(displayName),
  displayName: displayName.trim()
});

const mapTagTextToCreateArticleTagDtos = (value: string) => {
  return value
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0)
    .map(toCreateArticleTagDto);
};

export const mapPublicArticleCategoryResponseToModel = (category: PublicArticleCategoryResponse): PublicArticleCategoryModel => ({
  slug: category.slug,
  displayName: category.displayName
});

export const mapPublicArticleTagResponseToModel = (tag: PublicArticleTagResponse): PublicArticleTagModel => ({
  slug: tag.slug,
  displayName: tag.displayName
});

export const mapPublicRelatedProjectReferenceResponseToModel = (project: PublicRelatedProjectReferenceResponse): PublicRelatedProjectReferenceModel => ({
  projectId: project.projectId,
  label: project.label
});

export const mapPublicArticleListItemResponseToModel = (article: PublicArticleListItemResponse): PublicArticleListItemModel => ({
  id: article.id,
  slug: article.slug,
  title: article.title,
  summary: article.summary,
  category: mapPublicArticleCategoryResponseToModel(article.category),
  tags: article.tags.map(mapPublicArticleTagResponseToModel),
  status: article.status,
  visibility: article.visibility,
  updatedAt: toNullableDate(article.updatedAt),
  publishedAt: new Date(article.publishedAt)
});

export const mapPublicArticleDetailResponseToModel = (article: PublicArticleDetailResponse): PublicArticleDetailModel => ({
  ...mapPublicArticleListItemResponseToModel(article),
  bodyMarkdown: article.bodyMarkdown,
  relatedProjects: article.relatedProjects.map(mapPublicRelatedProjectReferenceResponseToModel)
});

export const mapPublicArticleDetailResponseToEntryModel = (article: PublicArticleDetailResponse): ArticleEntryModel => ({
  title: article.title,
  slug: article.slug,
  summary: article.summary,
  category: article.category.displayName,
  tags: article.tags.map((tag) => tag.displayName).join(', '),
  bodyMarkdown: article.bodyMarkdown,
  status: article.status,
  visibility: article.visibility
});

export const mapPublicArticleSearchDocumentResponseToModel = (document: PublicArticleSearchDocumentResponse): PublicArticleSearchDocumentModel => ({
  id: document.id,
  type: document.type,
  slug: document.slug,
  title: document.title,
  summary: document.summary,
  category: document.category,
  tags: document.tags,
  bodyText: document.bodyText,
  url: document.url,
  updatedAt: toNullableDate(document.updatedAt),
  publishedAt: toNullableDate(document.publishedAt)
});

export const mapPublicSearchIndexResponseToModel = (response: PublicSearchIndexResponse): PublicSearchIndexModel => ({
  generatedAt: new Date(response.generatedAt),
  documents: response.documents.map(mapPublicArticleSearchDocumentResponseToModel)
});

const mapArticleEntryModelToRequestDto = (article: ArticleEntryModel): CreateArticleRequestDto => ({
  title: article.title,
  slug: article.slug,
  summary: article.summary,
  category: toCreateArticleCategoryDto(article.category),
  tags: mapTagTextToCreateArticleTagDtos(article.tags),
  bodyMarkdown: article.bodyMarkdown,
  status: article.status,
  visibility: article.visibility
});

export const mapArticleEntryModelToCreateRequestDto = (article: ArticleEntryModel): CreateArticleRequestDto => mapArticleEntryModelToRequestDto(article);

export const mapArticleEntryModelToUpdateRequestDto = (article: ArticleEntryModel): UpdateArticleRequestDto => mapArticleEntryModelToRequestDto(article);

export const mapCreateArticleResponseDtoToModel = (response: CreateArticleResponseDto): ArticleSaveResultModel => ({
  articleId: response.articleId,
  slug: response.slug
});

export const mapUpdateArticleResponseDtoToModel = (response: UpdateArticleResponseDto): ArticleSaveResultModel => ({
  articleId: response.articleId,
  slug: response.slug
});
