import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mapCreateNoteResponseDtoToModel, mapNoteEntryModelToCreateRequestDto, mapNoteEntryModelToUpdateRequestDto, mapUpdateNoteResponseDtoToModel } from '../mappers/note.mapper';
import type { NoteEntryModel } from '../types/note.types';
import { noteKeys } from './note.queries';
import { noteService } from '../services/note.services';

export const useCreateNoteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (note: NoteEntryModel) => mapCreateNoteResponseDtoToModel(await noteService.createNote(mapNoteEntryModelToCreateRequestDto(note))),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: noteKeys.lists() });
    }
  });
};

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
