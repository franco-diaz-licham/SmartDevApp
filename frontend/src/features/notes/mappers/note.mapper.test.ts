import { describe, expect, test } from 'vitest';
import type { PublicNoteDetailResponse, PublicSearchIndexResponse } from '../types/note.api.types';
import { mapPublicNoteDetailResponseToModel, mapPublicSearchIndexResponseToModel } from './note.mapper';

describe('note mapper', () => {
  test('maps a public note detail response into the frontend model', () => {
    // Arrange
    const response: PublicNoteDetailResponse = {
      id: 'note-1',
      slug: 'cosmos-notes',
      title: 'Cosmos Notes',
      summary: 'Notes about Cosmos DB.',
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
    const note = mapPublicNoteDetailResponseToModel(response);

    // Assert
    expect(note).toMatchObject({
      id: 'note-1',
      slug: 'cosmos-notes',
      title: 'Cosmos Notes',
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
    expect(note.publishedAt).toEqual(new Date('2026-08-06T08:00:00Z'));
  });

  test('maps the public search index response into dated search documents', () => {
    // Arrange
    const response: PublicSearchIndexResponse = {
      generatedAt: '2026-08-06T09:00:00Z',
      documents: [
        {
          id: 'note-1',
          type: 'note',
          slug: 'cosmos-notes',
          title: 'Cosmos Notes',
          summary: 'Notes about Cosmos DB.',
          category: 'Backend',
          tags: ['.NET'],
          bodyText: 'Cosmos DB notes.',
          url: '/workspace/notes/1f4d0b3f-10a9-4c59-9e91-65cb3770887f',
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
      id: 'note-1',
      type: 'note',
      slug: 'cosmos-notes',
      category: 'Backend',
      tags: ['.NET'],
      publishedAt: null
    });
    expect(index.documents[0].updatedAt).toEqual(new Date('2026-08-06T09:30:00Z'));
  });
});
