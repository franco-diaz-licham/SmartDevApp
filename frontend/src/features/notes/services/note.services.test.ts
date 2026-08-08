import { beforeEach, describe, expect, test, vi, type Mock } from 'vitest';
import { apiClient } from '@/lib/api/apiClient';
import type { PublicNoteDetailResponse, PublicNoteListItemResponse, PublicSearchIndexResponse } from '../types/note.api.types';
import { noteService } from './note.services';

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

const noteListItemResponse: PublicNoteListItemResponse = {
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
  updatedAt: null,
  publishedAt: '2026-08-06T08:00:00Z'
};

const noteDetailResponse: PublicNoteDetailResponse = {
  ...noteListItemResponse,
  bodyMarkdown: '# Cosmos DB',
  relatedProjects: []
};

const searchIndexResponse: PublicSearchIndexResponse = {
  generatedAt: '2026-08-06T09:00:00Z',
  documents: []
};

describe('noteService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('gets public notes', async () => {
    // Arrange
    apiClientMock.getPage.mockResolvedValue({
      items: [noteListItemResponse],
      continuationToken: 'next-token',
      hasMore: true
    });

    // Act
    const result = await noteService.getPublicNotes({
      pageSize: 10,
      continuationToken: 'current-token'
    });

    // Assert
    expect(result).toEqual({
      items: [noteListItemResponse],
      continuationToken: 'next-token',
      hasMore: true
    });
    expect(apiClientMock.getPage).toHaveBeenCalledWith('/notes', {
      pageSize: 10,
      continuationToken: 'current-token'
    });
  });

  test('gets owner notes', async () => {
    // Arrange
    apiClientMock.getPage.mockResolvedValue({
      items: [noteListItemResponse],
      continuationToken: 'next-token',
      hasMore: true
    });

    // Act
    const result = await noteService.getOwnerNotes({
      pageSize: 10,
      continuationToken: 'current-token'
    });

    // Assert
    expect(result).toEqual({
      items: [noteListItemResponse],
      continuationToken: 'next-token',
      hasMore: true
    });
    expect(apiClientMock.getPage).toHaveBeenCalledWith('/owner/notes', {
      pageSize: 10,
      continuationToken: 'current-token'
    });
  });

  test('gets a public note by slug', async () => {
    // Arrange
    apiClientMock.getSingle.mockResolvedValue(noteDetailResponse);

    // Act
    const result = await noteService.getPublicNoteBySlug('cosmos notes');

    // Assert
    expect(result).toEqual(noteDetailResponse);
    expect(apiClientMock.getSingle).toHaveBeenCalledWith('/notes/cosmos%20notes');
  });

  test('gets public note categories', async () => {
    // Arrange
    apiClientMock.getPage.mockResolvedValue({
      items: ['Backend'],
      continuationToken: null,
      hasMore: false
    });

    // Act
    const result = await noteService.getPublicNoteCategories({ pageSize: 10 });

    // Assert
    expect(result).toEqual({
      items: ['Backend'],
      continuationToken: null,
      hasMore: false
    });
    expect(apiClientMock.getPage).toHaveBeenCalledWith('/notes/categories', { pageSize: 10 });
  });

  test('gets public note tags', async () => {
    // Arrange
    apiClientMock.getPage.mockResolvedValue({
      items: ['.NET'],
      continuationToken: null,
      hasMore: false
    });

    // Act
    const result = await noteService.getPublicNoteTags({ pageSize: 10 });

    // Assert
    expect(result).toEqual({
      items: ['.NET'],
      continuationToken: null,
      hasMore: false
    });
    expect(apiClientMock.getPage).toHaveBeenCalledWith('/notes/tags', { pageSize: 10 });
  });

  test('searches public notes', async () => {
    // Arrange
    apiClientMock.getPage.mockResolvedValue({
      items: [noteListItemResponse],
      continuationToken: null,
      hasMore: false
    });

    // Act
    const result = await noteService.searchPublicNotes({
      searchTerm: 'cosmos',
      searchBy: 'title',
      pageSize: 10
    });

    // Assert
    expect(result).toEqual({
      items: [noteListItemResponse],
      continuationToken: null,
      hasMore: false
    });
    expect(apiClientMock.getPage).toHaveBeenCalledWith('/notes/search', {
      searchTerm: 'cosmos',
      searchBy: 'title',
      pageSize: 10
    });
  });

  test('gets the public note search index', async () => {
    // Arrange
    apiClientMock.getSingle.mockResolvedValue(searchIndexResponse);

    // Act
    const result = await noteService.getPublicNoteSearchIndex();

    // Assert
    expect(result).toEqual(searchIndexResponse);
    expect(apiClientMock.getSingle).toHaveBeenCalledWith('/notes/search-index');
  });

  test('creates an owner note', async () => {
    // Arrange
    const request = {
      title: 'Cosmos Notes',
      slug: 'cosmos-notes',
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
      bodyMarkdown: '# Cosmos DB'
    };

    const response = {
      noteId: '5f4d0b3f-10a9-4c59-9e91-65cb3770887f',
      slug: 'cosmos-notes'
    };

    apiClientMock.post.mockResolvedValue(response);

    // Act
    const result = await noteService.createNote(request);

    // Assert
    expect(result).toEqual(response);
    expect(apiClientMock.post).toHaveBeenCalledWith('/owner/notes', request);
  });

  test('updates an owner note by id', async () => {
    // Arrange
    const request = {
      title: 'Updated Cosmos Notes',
      slug: 'updated-cosmos-notes',
      summary: 'Updated notes about Cosmos DB.',
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
      bodyMarkdown: '# Updated Cosmos DB'
    };

    const response = {
      noteId: '5f4d0b3f-10a9-4c59-9e91-65cb3770887f',
      slug: 'updated-cosmos-notes'
    };

    apiClientMock.put.mockResolvedValue(response);

    // Act
    const result = await noteService.updateNote('5f4d0b3f-10a9-4c59-9e91-65cb3770887f', request);

    // Assert
    expect(result).toEqual(response);
    expect(apiClientMock.put).toHaveBeenCalledWith('/owner/notes/5f4d0b3f-10a9-4c59-9e91-65cb3770887f', request);
  });
});
