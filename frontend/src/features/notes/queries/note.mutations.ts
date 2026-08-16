import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mapCreateNoteResponseDtoToModel, mapNoteEntryModelToCreateRequestDto, mapNoteEntryModelToUpdateRequestDto, mapUpdateNoteResponseDtoToModel } from '../mappers/note.mapper';
import type { NoteEntryModel } from '../types/note.types';
import { noteKeys } from './note.queries';
import { noteService } from '../services/note.services';

/**
 * Creates an owner note and refreshes cached note lists after a successful save.
 *
 * @returns React Query mutation state for creating a note from editor values.
 */
export const useCreateNoteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (note: NoteEntryModel) => mapCreateNoteResponseDtoToModel(await noteService.createNote(mapNoteEntryModelToCreateRequestDto(note))),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: noteKeys.lists() });
    }
  });
};

/**
 * Updates an owner note and refreshes cached list/detail note queries after a
 * successful save.
 *
 * @param noteId - Existing note identifier to update.
 * @returns React Query mutation state for updating a note from editor values.
 */
export const useUpdateNoteMutation = (noteId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (note: NoteEntryModel) => mapUpdateNoteResponseDtoToModel(await noteService.updateNote(noteId, mapNoteEntryModelToUpdateRequestDto(note))),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: noteKeys.lists() });
      await queryClient.invalidateQueries({ queryKey: noteKeys.details() });
    }
  });
};
