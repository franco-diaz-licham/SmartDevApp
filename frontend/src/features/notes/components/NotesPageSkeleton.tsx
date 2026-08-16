import { WorkspacePageWrapper } from '@/components/common/WorkspacePageWrapper';
import { NotesCategoryPaneSkeleton } from './NotesCategoryPaneSkeleton';
import { NotesListSkeleton } from './NotesListItemSkeleton';
import { NotesToolbarSkeleton } from './NotesToolbarSkeleton';

export const NotesPageSkeleton = () => (
  <WorkspacePageWrapper>
    <div className="mx-auto grid h-full min-h-0 max-w-[1560px] grid-cols-1 overflow-hidden lg:grid-cols-[17rem_minmax(0,1fr)]" role="status" aria-label="Loading notes">
      <NotesCategoryPaneSkeleton />

      <section className="h-full min-h-0 min-w-0 overflow-hidden px-5 py-6 sm:px-8 lg:px-10">
        <NotesToolbarSkeleton />

        <div className="mt-8 space-y-4">
          <NotesListSkeleton />
        </div>
      </section>
    </div>
  </WorkspacePageWrapper>
);
