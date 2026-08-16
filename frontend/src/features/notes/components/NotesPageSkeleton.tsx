import { WorkspacePageWrapper } from '@/components/common/WorkspacePageWrapper';
import { WorkspaceSkeletonBlock } from '@/components/common/WorkspaceSkeletonBlock';

const rows = Array.from({ length: 5 }, (_, index) => index);

export const NotesPageSkeleton = () => (
  <WorkspacePageWrapper>
    <div className="mx-auto grid h-full min-h-0 max-w-[1560px] grid-cols-1 overflow-hidden lg:grid-cols-[17rem_minmax(0,1fr)]" role="status" aria-label="Loading notes">
      <aside className="hidden h-full min-h-0 overflow-hidden border-r border-border px-5 py-6 lg:block xl:px-6">
        <WorkspaceSkeletonBlock width="7rem" height="0.75rem" className="bg-primary/15" />
        <WorkspaceSkeletonBlock width="11rem" height="2rem" className="mt-4" />
        <WorkspaceSkeletonBlock width="8rem" height="1rem" className="mt-10" />
        <WorkspaceSkeletonBlock height="2.25rem" className="mt-4" />
        <WorkspaceSkeletonBlock height="2.25rem" className="mt-3" />
        <WorkspaceSkeletonBlock height="2.25rem" className="mt-3" />
      </aside>

      <section className="h-full min-h-0 min-w-0 overflow-hidden px-5 py-6 sm:px-8 lg:px-10">
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_8rem] sm:items-end">
          <WorkspaceSkeletonBlock height="3rem" />
          <WorkspaceSkeletonBlock height="3rem" className="hidden sm:block" />
        </div>

        <div className="mt-8 space-y-4">
          {rows.map((row) => (
            <div key={row} className="rounded-md border border-border bg-muted/30 p-4">
              <WorkspaceSkeletonBlock width="35%" height="1rem" className="bg-primary/15" />
              <WorkspaceSkeletonBlock width="70%" height="1.5rem" className="mt-4" />
              <WorkspaceSkeletonBlock height="1rem" className="mt-5" />
              <WorkspaceSkeletonBlock width="85%" height="1rem" className="mt-3" />
            </div>
          ))}
        </div>
      </section>
    </div>
  </WorkspacePageWrapper>
);
