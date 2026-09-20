import { WorkspacePageWrapper } from '@/components/common/WorkspacePageWrapper';
import { ArticlesSkeletonBlock } from '@/components/common/ArticlesSkeletonBlock';

export const JournalEntryPageSkeleton = () => (
  <WorkspacePageWrapper>
    <div className="mx-auto grid max-w-[1500px] gap-6 p-5 sm:p-8 lg:grid-cols-[1fr_22rem] lg:p-10" role="status" aria-label="Loading journal entry">
      <main className="min-w-0">
        <ArticlesSkeletonBlock className="h-12 w-2/3" />
        <ArticlesSkeletonBlock className="mt-6 h-80 w-full" />
      </main>
      <aside>
        <ArticlesSkeletonBlock className="h-56 w-full" />
      </aside>
    </div>
  </WorkspacePageWrapper>
);
