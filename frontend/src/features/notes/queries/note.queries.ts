import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import type { BaseQuery } from '@/lib/api/api.types';
import { mapPublicNoteDetailResponseToModel, mapPublicNoteListItemResponseToModel, mapPublicSearchIndexResponseToModel } from '../mappers/note.mapper';
import { noteService } from '../services/note.services';

export const noteKeys = {
  all: ['notes'] as const,
  lists: () => [...noteKeys.all, 'list'] as const,
  publicList: (query: BaseQuery) => [...noteKeys.lists(), 'public', query] as const,
  details: () => [...noteKeys.all, 'detail'] as const,
  publicDetail: (slug: string) => [...noteKeys.details(), 'public', slug] as const,
  publicCategories: () => [...noteKeys.all, 'public-categories'] as const,
  publicTags: () => [...noteKeys.all, 'public-tags'] as const,
  publicSearch: (query: BaseQuery) => [...noteKeys.all, 'public-search', query] as const,
  publicSearchIndex: () => [...noteKeys.all, 'public-search-index'] as const
};

export const usePublicNotesQuery = (query: BaseQuery = {}) => {
  const initialQuery = {
    pageSize: 20,
    ...query
  };

  return useInfiniteQuery({
    queryKey: noteKeys.publicList(initialQuery),
    queryFn: async ({ pageParam }) => {
      const page = await noteService.getPublicNotes({
        ...initialQuery,
        continuationToken: pageParam
      });

      return {
        ...page,
        items: page.items.map(mapPublicNoteListItemResponseToModel)
      };
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.continuationToken
  });
};

export const usePublicNoteSearchQuery = (query: BaseQuery) =>
  useQuery({
    queryKey: noteKeys.publicSearch(query),
    queryFn: async () => (await noteService.searchPublicNotes(query)).map(mapPublicNoteListItemResponseToModel),
    enabled: Boolean(query.searchTerm?.trim())
  });

export const usePublicNoteQuery = (slug: string) =>
  useQuery({
    queryKey: noteKeys.publicDetail(slug),
    queryFn: async () => mapPublicNoteDetailResponseToModel(await noteService.getPublicNoteBySlug(slug)),
    enabled: slug.trim().length > 0
  });

export const usePublicNoteCategoriesQuery = () =>
  useQuery({
    queryKey: noteKeys.publicCategories(),
    queryFn: () => noteService.getPublicNoteCategories()
  });

export const usePublicNoteTagsQuery = () =>
  useQuery({
    queryKey: noteKeys.publicTags(),
    queryFn: () => noteService.getPublicNoteTags()
  });

export const usePublicNoteSearchIndexQuery = () =>
  useQuery({
    queryKey: noteKeys.publicSearchIndex(),
    queryFn: async () => mapPublicSearchIndexResponseToModel(await noteService.getPublicNoteSearchIndex())
  });
