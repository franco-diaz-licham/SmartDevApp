import { WorkspacePageWrapper } from '@/components/common/WorkspacePageWrapper';
import { NoteArticleContentSkeleton } from './NoteArticleContentSkeleton';
import { NoteArticleMetadataSkeleton } from './NoteArticleMetadataSkeleton';
import { NoteSectionsPaneSkeleton } from './NoteSectionsPaneSkeleton';

export const NoteArticlePageSkeleton = () => (
  <WorkspacePageWrapper>
    <div className="mx-auto grid h-full min-h-0 max-w-[1560px] grid-cols-1 overflow-hidden lg:grid-cols-[17rem_minmax(0,1fr)] xl:grid-cols-[17rem_minmax(0,1fr)_18rem]" role="status" aria-label="Loading note">
      <NoteSectionsPaneSkeleton />

      <article className="min-h-0 min-w-0 overflow-hidden px-5 py-7 sm:px-8 lg:px-10">
        <NoteArticleContentSkeleton />
      </article>

      <NoteArticleMetadataSkeleton />
    </div>
  </WorkspacePageWrapper>
);
