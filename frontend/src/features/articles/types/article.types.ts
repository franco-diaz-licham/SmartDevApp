export type ArticleStatusModel = 'Draft' | 'Published' | 'Archived';

export type ArticleVisibilityModel = 'Private' | 'Public';

export interface PublicArticleCategoryModel {
  slug: string;
  displayName: string;
}

export interface PublicArticleTagModel {
  slug: string;
  displayName: string;
}

export interface PublicRelatedProjectReferenceModel {
  projectId: string;
  label: string;
}

export interface PublicArticleListItemModel {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: PublicArticleCategoryModel;
  tags: PublicArticleTagModel[];
  status: ArticleStatusModel;
  visibility: ArticleVisibilityModel;
  updatedAt: Date | null;
  publishedAt: Date;
}

export interface PublicArticleDetailModel extends PublicArticleListItemModel {
  bodyMarkdown: string;
  relatedProjects: PublicRelatedProjectReferenceModel[];
}

export interface PublicArticleSearchDocumentModel {
  id: string;
  type: 'article';
  slug: string;
  title: string;
  summary: string;
  category: string;
  tags: string[];
  bodyText: string;
  url: string;
  updatedAt: Date | null;
  publishedAt: Date | null;
}

export interface PublicSearchIndexModel {
  generatedAt: Date;
  documents: PublicArticleSearchDocumentModel[];
}

export interface ArticleEntryModel {
  title: string;
  slug: string;
  summary: string;
  category: string;
  tags: string;
  bodyMarkdown: string;
  status: ArticleStatusModel;
  visibility: ArticleVisibilityModel;
}

export interface ArticleSaveResultModel {
  articleId: string;
  slug: string;
}
