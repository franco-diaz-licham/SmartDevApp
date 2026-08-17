import { beforeEach, describe, expect, test, vi, type Mock } from 'vitest';
import { apiClient } from '@/lib/api/apiClient';
import type { CreateArticleRequestDto, PublicArticleDetailResponse, PublicArticleListItemResponse, PublicSearchIndexResponse, UpdateArticleRequestDto } from '../types/article.api.types';
import { articleService } from './article.services';

vi.mock('@/lib/api/apiClient', () => ({
  apiClient: {
    getPage: vi.fn(),
    getList: vi.fn(),
    getSingle: vi.fn(),
    post: vi.fn(),
    put: vi.fn()
  }
}));

const apiClientMock = apiClient as unknown as {
  getPage: Mock;
  getList: Mock;
  getSingle: Mock;
  post: Mock;
  put: Mock;
};

const articleListItemResponse: PublicArticleListItemResponse = {
  id: 'article-1',
  slug: 'cosmos-articles',
  title: 'Cosmos Articles',
  summary: 'Articles about Cosmos DB.',
  category: {
    slug: 'backend',
    displayName: 'Backend'
  },
  tags: [
    {
      slug: 'dotnet',
      displayName: '.NET'
    }
  ],
  status: 'Published',
  visibility: 'Public',
  updatedAt: null,
  publishedAt: '2026-08-06T08:00:00Z'
};

const articleDetailResponse: PublicArticleDetailResponse = {
  ...articleListItemResponse,
  bodyMarkdown: '# Cosmos DB',
  relatedProjects: []
};

const searchIndexResponse: PublicSearchIndexResponse = {
  generatedAt: '2026-08-06T09:00:00Z',
  documents: []
};

describe('articleService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('gets public articles', async () => {
    // Arrange
    apiClientMock.getPage.mockResolvedValue({
      items: [articleListItemResponse],
      continuationToken: 'next-token',
      hasMore: true
    });

    // Act
    const result = await articleService.getPublicArticles({
      pageSize: 10,
      continuationToken: 'current-token'
    });

    // Assert
    expect(result).toEqual({
      items: [articleListItemResponse],
      continuationToken: 'next-token',
      hasMore: true
    });
    expect(apiClientMock.getPage).toHaveBeenCalledWith('/articles', {
      pageSize: 10,
      continuationToken: 'current-token'
    });
  });

  test('gets owner articles', async () => {
    // Arrange
    apiClientMock.getPage.mockResolvedValue({
      items: [articleListItemResponse],
      continuationToken: 'next-token',
      hasMore: true
    });

    // Act
    const result = await articleService.getOwnerArticles({
      pageSize: 10,
      continuationToken: 'current-token'
    });

    // Assert
    expect(result).toEqual({
      items: [articleListItemResponse],
      continuationToken: 'next-token',
      hasMore: true
    });
    expect(apiClientMock.getPage).toHaveBeenCalledWith('/owner/articles', {
      pageSize: 10,
      continuationToken: 'current-token'
    });
  });

  test('gets a public article by id', async () => {
    // Arrange
    apiClientMock.getSingle.mockResolvedValue(articleDetailResponse);

    // Act
    const result = await articleService.getPublicArticleById('5f4d0b3f-10a9-4c59-9e91-65cb3770887f');

    // Assert
    expect(result).toEqual(articleDetailResponse);
    expect(apiClientMock.getSingle).toHaveBeenCalledWith('/articles/5f4d0b3f-10a9-4c59-9e91-65cb3770887f');
  });

  test('gets an owner article by id', async () => {
    // Arrange
    apiClientMock.getSingle.mockResolvedValue(articleDetailResponse);

    // Act
    const result = await articleService.getOwnerArticleById('5f4d0b3f-10a9-4c59-9e91-65cb3770887f');

    // Assert
    expect(result).toEqual(articleDetailResponse);
    expect(apiClientMock.getSingle).toHaveBeenCalledWith('/owner/articles/5f4d0b3f-10a9-4c59-9e91-65cb3770887f');
  });

  test('gets public article categories', async () => {
    // Arrange
    apiClientMock.getPage.mockResolvedValue({
      items: ['Backend'],
      continuationToken: null,
      hasMore: false
    });

    // Act
    const result = await articleService.getPublicArticleCategories({ pageSize: 10 });

    // Assert
    expect(result).toEqual({
      items: ['Backend'],
      continuationToken: null,
      hasMore: false
    });
    expect(apiClientMock.getPage).toHaveBeenCalledWith('/articles/categories', { pageSize: 10 });
  });

  test('gets owner article categories', async () => {
    // Arrange
    apiClientMock.getPage.mockResolvedValue({
      items: ['Backend'],
      continuationToken: null,
      hasMore: false
    });

    // Act
    const result = await articleService.getOwnerArticleCategories({ pageSize: 10 });

    // Assert
    expect(result).toEqual({
      items: ['Backend'],
      continuationToken: null,
      hasMore: false
    });
    expect(apiClientMock.getPage).toHaveBeenCalledWith('/owner/articles/categories', { pageSize: 10 });
  });

  test('gets public article tags', async () => {
    // Arrange
    apiClientMock.getPage.mockResolvedValue({
      items: ['.NET'],
      continuationToken: null,
      hasMore: false
    });

    // Act
    const result = await articleService.getPublicArticleTags({ pageSize: 10 });

    // Assert
    expect(result).toEqual({
      items: ['.NET'],
      continuationToken: null,
      hasMore: false
    });
    expect(apiClientMock.getPage).toHaveBeenCalledWith('/articles/tags', { pageSize: 10 });
  });

  test('searches public articles', async () => {
    // Arrange
    apiClientMock.getPage.mockResolvedValue({
      items: [articleListItemResponse],
      continuationToken: null,
      hasMore: false
    });

    // Act
    const result = await articleService.searchPublicArticles({
      searchTerm: 'cosmos',
      searchBy: 'title',
      pageSize: 10
    });

    // Assert
    expect(result).toEqual({
      items: [articleListItemResponse],
      continuationToken: null,
      hasMore: false
    });
    expect(apiClientMock.getPage).toHaveBeenCalledWith('/articles/search', {
      searchTerm: 'cosmos',
      searchBy: 'title',
      pageSize: 10
    });
  });

  test('gets the public article search index', async () => {
    // Arrange
    apiClientMock.getSingle.mockResolvedValue(searchIndexResponse);

    // Act
    const result = await articleService.getPublicArticleSearchIndex();

    // Assert
    expect(result).toEqual(searchIndexResponse);
    expect(apiClientMock.getSingle).toHaveBeenCalledWith('/articles/search-index');
  });

  test('creates an owner article', async () => {
    // Arrange
    const request: CreateArticleRequestDto = {
      title: 'Cosmos Articles',
      slug: 'cosmos-articles',
      summary: 'Articles about Cosmos DB.',
      category: {
        slug: 'backend',
        displayName: 'Backend'
      },
      tags: [
        {
          slug: 'dotnet',
          displayName: '.NET'
        }
      ],
      bodyMarkdown: '# Cosmos DB',
      status: 'Draft',
      visibility: 'Private'
    };

    const response = {
      articleId: '5f4d0b3f-10a9-4c59-9e91-65cb3770887f',
      slug: 'cosmos-articles'
    };

    apiClientMock.post.mockResolvedValue(response);

    // Act
    const result = await articleService.createArticle(request);

    // Assert
    expect(result).toEqual(response);
    expect(apiClientMock.post).toHaveBeenCalledWith('/owner/articles', request);
  });

  test('updates an owner article by id', async () => {
    // Arrange
    const request: UpdateArticleRequestDto = {
      title: 'Updated Cosmos Articles',
      slug: 'updated-cosmos-articles',
      summary: 'Updated articles about Cosmos DB.',
      category: {
        slug: 'backend',
        displayName: 'Backend'
      },
      tags: [
        {
          slug: 'dotnet',
          displayName: '.NET'
        }
      ],
      bodyMarkdown: '# Updated Cosmos DB',
      status: 'Published',
      visibility: 'Public'
    };

    const response = {
      articleId: '5f4d0b3f-10a9-4c59-9e91-65cb3770887f',
      slug: 'updated-cosmos-articles'
    };

    apiClientMock.put.mockResolvedValue(response);

    // Act
    const result = await articleService.updateArticle('5f4d0b3f-10a9-4c59-9e91-65cb3770887f', request);

    // Assert
    expect(result).toEqual(response);
    expect(apiClientMock.put).toHaveBeenCalledWith('/owner/articles/5f4d0b3f-10a9-4c59-9e91-65cb3770887f', request);
  });
});
