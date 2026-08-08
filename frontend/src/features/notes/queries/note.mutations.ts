import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mapCreateNoteModelToRequestDto } from '../mappers/note.mapper';
import type { CreateNoteModel } from '../types/note.types';
import { noteKeys } from './note.queries';
import { noteService } from '../services/note.services';

export const useCreateNoteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (note: CreateNoteModel) => noteService.createNote(mapCreateNoteModelToRequestDto(note)),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: noteKeys.lists() });
    }
  });
};
