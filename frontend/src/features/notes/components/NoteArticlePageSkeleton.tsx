import { WorkspacePageWrapper } from '@/components/common/WorkspacePageWrapper';
import { WorkspaceSkeletonBlock } from '@/components/common/WorkspaceSkeletonBlock';

const navRows = Array.from({ length: 4 }, (_, index) => index);
const bodyRows = Array.from({ length: 8 }, (_, index) => index);

export const NoteArticlePageSkeleton = () => (
  <WorkspacePageWrapper>
    <div className="mx-auto grid h-full min-h-0 max-w-[1560px] grid-cols-1 overflow-hidden lg:grid-cols-[17rem_minmax(0,1fr)] xl:grid-cols-[17rem_minmax(0,1fr)_18rem]" role="status" aria-label="Loading note">
      <aside className="hidden min-h-0 overflow-hidden border-r border-border px-6 py-8 lg:block">
        <WorkspaceSkeletonBlock width="7rem" height="1rem" />
        <div className="mt-6 space-y-3">
          {navRows.map((row) => (
            <WorkspaceSkeletonBlock key={row} height="1.25rem" width={row === 0 ? '80%' : '65%'} />
          ))}
        </div>
      </aside>

      <article className="min-h-0 min-w-0 overflow-hidden px-5 py-7 sm:px-8 lg:px-10">
        <WorkspaceSkeletonBlock width="5rem" height="0.75rem" className="bg-primary/15" />
        <WorkspaceSkeletonBlock width="72%" height="2.75rem" className="mt-4" />
        <WorkspaceSkeletonBlock width="92%" height="1.25rem" className="mt-8" />
        <WorkspaceSkeletonBlock width="75%" height="1.25rem" className="mt-3" />

        <div className="mt-10 border-t border-border pt-8">
          {bodyRows.map((row) => (
            <WorkspaceSkeletonBlock key={row} height="1rem" width={row % 3 === 2 ? '72%' : '100%'} className="mt-4 first:mt-0" />
          ))}
        </div>
      </article>

      <aside className="hidden min-h-0 overflow-hidden border-l border-border px-5 py-6 xl:block">
        <WorkspaceSkeletonBlock width="8rem" height="1rem" />
        <WorkspaceSkeletonBlock height="2.5rem" className="mt-6" />
        <WorkspaceSkeletonBlock height="2.5rem" className="mt-3" />
        <WorkspaceSkeletonBlock width="65%" height="1rem" className="mt-8" />
      </aside>
    </div>
  </WorkspacePageWrapper>
);
