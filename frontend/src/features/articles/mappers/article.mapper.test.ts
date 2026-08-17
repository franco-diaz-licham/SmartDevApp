import { describe, expect, test } from 'vitest';
import type { PublicArticleDetailResponse, PublicSearchIndexResponse } from '../types/article.api.types';
import { mapPublicArticleDetailResponseToModel, mapPublicSearchIndexResponseToModel } from './article.mapper';

describe('article mapper', () => {
  test('maps a public article detail response into the frontend model', () => {
    // Arrange
    const response: PublicArticleDetailResponse = {
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
      bodyMarkdown: '# Cosmos DB',
      relatedProjects: [
        {
          projectId: 'smartdev',
          label: 'SmartDevApp'
        }
      ],
      updatedAt: null,
      publishedAt: '2026-08-06T08:00:00Z'
    };

    // Act
    const article = mapPublicArticleDetailResponseToModel(response);

    // Assert
    expect(article).toMatchObject({
      id: 'article-1',
      slug: 'cosmos-articles',
      title: 'Cosmos Articles',
      category: {
        slug: 'backend',
        displayName: 'Backend'
      },
      tags: [{ slug: 'dotnet', displayName: '.NET' }],
      status: 'Published',
      visibility: 'Public',
      bodyMarkdown: '# Cosmos DB',
      relatedProjects: [{ projectId: 'smartdev', label: 'SmartDevApp' }],
      updatedAt: null
    });
    expect(article.publishedAt).toEqual(new Date('2026-08-06T08:00:00Z'));
  });

  test('maps the public search index response into dated search documents', () => {
    // Arrange
    const response: PublicSearchIndexResponse = {
      generatedAt: '2026-08-06T09:00:00Z',
      documents: [
        {
          id: 'article-1',
          type: 'article',
          slug: 'cosmos-articles',
          title: 'Cosmos Articles',
          summary: 'Articles about Cosmos DB.',
          category: 'Backend',
          tags: ['.NET'],
          bodyText: 'Cosmos DB articles.',
          url: '/workspace/articles/1f4d0b3f-10a9-4c59-9e91-65cb3770887f',
          updatedAt: '2026-08-06T09:30:00Z',
          publishedAt: null
        }
      ]
    };

    // Act
    const index = mapPublicSearchIndexResponseToModel(response);

    // Assert
    expect(index.generatedAt).toEqual(new Date('2026-08-06T09:00:00Z'));
    expect(index.documents[0]).toMatchObject({
      id: 'article-1',
      type: 'article',
      slug: 'cosmos-articles',
      category: 'Backend',
      tags: ['.NET'],
      publishedAt: null
    });
    expect(index.documents[0].updatedAt).toEqual(new Date('2026-08-06T09:30:00Z'));
  });
});
