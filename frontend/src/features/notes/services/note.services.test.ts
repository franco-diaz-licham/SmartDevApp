import { beforeEach, describe, expect, test, vi, type Mock } from 'vitest';
import { apiClient } from '@/lib/api/apiClient';
import type { PublicNoteDetailResponse, PublicNoteListItemResponse, PublicSearchIndexResponse } from '../types/note.api.types';
import { noteService } from './note.services';

vi.mock('@/lib/api/apiClient', () => ({
  apiClient: {
    getPage: vi.fn(),
    getList: vi.fn(),
    getSingle: vi.fn()
  }
}));

const apiClientMock = apiClient as unknown as {
  getPage: Mock;
  getList: Mock;
  getSingle: Mock;
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
    apiClientMock.getList.mockResolvedValue(['Backend']);

    // Act
    const result = await noteService.getPublicNoteCategories();

    // Assert
    expect(result).toEqual(['Backend']);
    expect(apiClientMock.getList).toHaveBeenCalledWith('/notes/categories');
  });

  test('gets public note tags', async () => {
    // Arrange
    apiClientMock.getList.mockResolvedValue(['.NET']);

    // Act
    const result = await noteService.getPublicNoteTags();

    // Assert
    expect(result).toEqual(['.NET']);
    expect(apiClientMock.getList).toHaveBeenCalledWith('/notes/tags');
  });

  test('searches public notes', async () => {
    // Arrange
    apiClientMock.getList.mockResolvedValue([noteListItemResponse]);

    // Act
    const result = await noteService.searchPublicNotes({
      searchTerm: 'cosmos',
      searchBy: 'title',
      pageSize: 10
    });

    // Assert
    expect(result).toEqual([noteListItemResponse]);
    expect(apiClientMock.getList).toHaveBeenCalledWith('/notes/search', {
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
});
