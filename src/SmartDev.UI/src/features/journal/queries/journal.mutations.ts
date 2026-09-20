import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mapJournalEntryFormModelToRequestDto, mapJournalSaveResultResponseToModel } from '../mappers/journal.mapper';
import { journalService } from '../services/journal.services';
import type { JournalEntryFormModel } from '../types/journal.types';
import { journalKeys } from './journal.queries';

export const useCreateJournalEntryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entry: JournalEntryFormModel) => mapJournalSaveResultResponseToModel(await journalService.createEntry(mapJournalEntryFormModelToRequestDto(entry))),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: journalKeys.lists() });
    }
  });
};

export const useUpdateJournalEntryMutation = (entryId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entry: JournalEntryFormModel) => mapJournalSaveResultResponseToModel(await journalService.updateEntry(entryId, mapJournalEntryFormModelToRequestDto(entry))),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: journalKeys.lists() });
      await queryClient.invalidateQueries({ queryKey: journalKeys.details() });
    }
  });
};
