import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import type { BaseQuery } from '@/lib/api/api.types';
import { mapPublicNoteDetailResponseToEntryModel, mapPublicNoteDetailResponseToModel, mapPublicNoteListItemResponseToModel, mapPublicSearchIndexResponseToModel } from '../mappers/note.mapper';
import { noteService } from '../services/note.services';

export const noteKeys = {
  all: ['notes'] as const,
  lists: () => [...noteKeys.all, 'list'] as const,
  publicList: (query: BaseQuery) => [...noteKeys.lists(), 'public', query] as const,
  ownerList: (query: BaseQuery) => [...noteKeys.lists(), 'owner', query] as const,
  details: () => [...noteKeys.all, 'detail'] as const,
  publicDetail: (slug: string) => [...noteKeys.details(), 'public', slug] as const,
  ownerDetail: (noteId: string) => [...noteKeys.details(), 'owner', noteId] as const,
  ownerEntry: (noteId: string) => [...noteKeys.details(), 'owner-entry', noteId] as const,
  publicCategories: (query: BaseQuery) => [...noteKeys.all, 'public-categories', query] as const,
  publicTags: (query: BaseQuery) => [...noteKeys.all, 'public-tags', query] as const,
  publicSearch: (query: BaseQuery) => [...noteKeys.all, 'public-search', query] as const,
  publicSearchIndex: () => [...noteKeys.all, 'public-search-index'] as const
};

export const usePublicNotesQuery = (query: BaseQuery = {}, enabled = true) => {
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
    getNextPageParam: (lastPage) => lastPage.continuationToken,
    enabled
  });
};

export const useOwnerNotesQuery = (query: BaseQuery = {}, enabled = true) => {
  const initialQuery = {
    pageSize: 20,
    ...query
  };

  return useInfiniteQuery({
    queryKey: noteKeys.ownerList(initialQuery),
    queryFn: async ({ pageParam }) => {
      const page = await noteService.getOwnerNotes({
        ...initialQuery,
        continuationToken: pageParam
      });

      return {
        ...page,
        items: page.items.map(mapPublicNoteListItemResponseToModel)
      };
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.continuationToken,
    enabled
  });
};

export const usePublicNoteSearchQuery = (query: BaseQuery) =>
  useQuery({
    queryKey: noteKeys.publicSearch(query),
    queryFn: async () => {
      const page = await noteService.searchPublicNotes(query);
      return {
        ...page,
        items: page.items.map(mapPublicNoteListItemResponseToModel)
      };
    },
    enabled: Boolean(query.searchTerm?.trim())
  });

export const usePublicNoteQuery = (slug: string) =>
  useQuery({
    queryKey: noteKeys.publicDetail(slug),
    queryFn: async () => mapPublicNoteDetailResponseToModel(await noteService.getPublicNoteBySlug(slug)),
    enabled: slug.trim().length > 0
  });

export const useOwnerNoteEntryQuery = (noteId: string) =>
  useQuery({
    queryKey: noteKeys.ownerEntry(noteId),
    queryFn: async () => mapPublicNoteDetailResponseToEntryModel(await noteService.getOwnerNoteById(noteId)),
    enabled: noteId.trim().length > 0
  });

export const useOwnerNoteQuery = (noteId: string) =>
  useQuery({
    queryKey: noteKeys.ownerDetail(noteId),
    queryFn: async () => mapPublicNoteDetailResponseToModel(await noteService.getOwnerNoteById(noteId)),
    enabled: noteId.trim().length > 0
  });

export const usePublicNoteCategoriesQuery = (query: BaseQuery = {}) =>
  useQuery({
    queryKey: noteKeys.publicCategories(query),
    queryFn: () => noteService.getPublicNoteCategories(query)
  });

export const usePublicNoteTagsQuery = (query: BaseQuery = {}) =>
  useQuery({
    queryKey: noteKeys.publicTags(query),
    queryFn: () => noteService.getPublicNoteTags(query)
  });

export const usePublicNoteSearchIndexQuery = () =>
  useQuery({
    queryKey: noteKeys.publicSearchIndex(),
    queryFn: async () => mapPublicSearchIndexResponseToModel(await noteService.getPublicNoteSearchIndex())
  });
