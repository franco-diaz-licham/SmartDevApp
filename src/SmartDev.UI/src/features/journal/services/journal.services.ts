import { apiClient } from '@/lib/api/apiClient';
import type { BaseQuery, PageResult } from '@/lib/api/api.types';
import type { JournalDetailResponse, JournalEntryRequestDto, JournalListItemResponse, JournalSaveResultResponse } from '../types/journal.api.types';

const OWNER_JOURNAL_URL = '/owner/journal';

export const journalService = {
  getEntries(request: BaseQuery = {}): Promise<PageResult<JournalListItemResponse>> {
    return apiClient.getPage<JournalListItemResponse, BaseQuery>(OWNER_JOURNAL_URL, request);
  },

  getEntryById(entryId: string): Promise<JournalDetailResponse> {
    return apiClient.getSingle<JournalDetailResponse>(`${OWNER_JOURNAL_URL}/${encodeURIComponent(entryId)}`);
  },

  createEntry(request: JournalEntryRequestDto): Promise<JournalSaveResultResponse> {
    return apiClient.post<JournalSaveResultResponse>(OWNER_JOURNAL_URL, request);
  },

  updateEntry(entryId: string, request: JournalEntryRequestDto): Promise<JournalSaveResultResponse> {
    return apiClient.put<JournalSaveResultResponse>(`${OWNER_JOURNAL_URL}/${encodeURIComponent(entryId)}`, request);
  }
};
