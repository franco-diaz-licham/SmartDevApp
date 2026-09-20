import type {
  JournalDetailResponse,
  JournalEntryRequestDto,
  JournalListItemResponse,
  JournalSaveResultResponse,
  JournalTagRequestDto
} from '../types/journal.api.types';
import type { JournalDetailModel, JournalEntryFormModel, JournalListItemModel, JournalSaveResultModel } from '../types/journal.types';

const toNullableDate = (value: string | null): Date | null => (value ? new Date(value) : null);
const trimOrNull = (value: string): string | null => {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const toSlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const splitTextList = (value: string): string[] =>
  value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

const mapTagsToRequest = (value: string): JournalTagRequestDto[] =>
  splitTextList(value).map((tag) => ({
    slug: toSlug(tag),
    displayName: tag
  }));

export const mapJournalListItemResponseToModel = (entry: JournalListItemResponse): JournalListItemModel => ({
  ...entry,
  createdAt: new Date(entry.createdAt),
  updatedAt: toNullableDate(entry.updatedAt)
});

export const mapJournalDetailResponseToModel = (entry: JournalDetailResponse): JournalDetailModel => ({
  ...mapJournalListItemResponseToModel(entry),
  bodyMarkdown: entry.bodyMarkdown,
  collaborators: entry.collaborators,
  relatedArticles: entry.relatedArticles,
  decisions: entry.decisions,
  blockers: entry.blockers,
  nextActions: entry.nextActions,
  archivedAt: toNullableDate(entry.archivedAt)
});

export const mapJournalDetailResponseToEntryFormModel = (entry: JournalDetailResponse): JournalEntryFormModel => ({
  title: entry.title,
  bodyMarkdown: entry.bodyMarkdown,
  entryType: entry.entryType,
  status: entry.status,
  tags: entry.tags.map((tag) => tag.displayName).join(', '),
  summary: entry.summary ?? '',
  companyName: entry.company?.name ?? '',
  companyRoleTitle: entry.company?.roleTitle ?? '',
  workplaceContext: entry.workplaceContext ?? '',
  outcome: entry.outcome ?? '',
  impact: entry.impact ?? '',
  collaborators: entry.collaborators.join(', '),
  confidence: entry.confidence,
  decisions: entry.decisions.join('\n'),
  blockers: entry.blockers.join('\n'),
  nextActions: entry.nextActions.join('\n'),
  occurredOn: entry.occurredOn
});

export const mapJournalEntryFormModelToRequestDto = (entry: JournalEntryFormModel): JournalEntryRequestDto => ({
  title: entry.title,
  bodyMarkdown: entry.bodyMarkdown,
  entryType: entry.entryType,
  status: entry.status,
  tags: mapTagsToRequest(entry.tags),
  summary: trimOrNull(entry.summary),
  company: trimOrNull(entry.companyName)
    ? {
        name: entry.companyName.trim(),
        roleTitle: trimOrNull(entry.companyRoleTitle)
      }
    : null,
  workplaceContext: trimOrNull(entry.workplaceContext),
  outcome: trimOrNull(entry.outcome),
  impact: trimOrNull(entry.impact),
  collaborators: splitTextList(entry.collaborators),
  confidence: entry.confidence,
  relatedArticles: [],
  decisions: splitTextList(entry.decisions),
  blockers: splitTextList(entry.blockers),
  nextActions: splitTextList(entry.nextActions),
  occurredOn: entry.occurredOn
});

export const mapJournalSaveResultResponseToModel = (response: JournalSaveResultResponse): JournalSaveResultModel => ({
  entryId: response.entryId
});
