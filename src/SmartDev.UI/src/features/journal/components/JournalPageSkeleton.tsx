import { WorkspacePageWrapper } from '@/components/common/WorkspacePageWrapper';
import { ArticlesSkeletonBlock } from '@/components/common/ArticlesSkeletonBlock';
import { JournalListSkeleton } from './JournalListSkeleton';

export const JournalPageSkeleton = () => (
  <WorkspacePageWrapper>
    <section className="h-full overflow-hidden px-5 py-6 sm:px-8 lg:px-10" role="status" aria-label="Loading journal">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
          <ArticlesSkeletonBlock className="h-16 w-full lg:flex-1" />
          <ArticlesSkeletonBlock className="h-16 w-full lg:w-48" />
          <ArticlesSkeletonBlock className="h-16 w-full lg:w-48" />
          <ArticlesSkeletonBlock className="h-16 w-full lg:w-44" />
        </div>
        <div className="mt-8 space-y-4">
          <JournalListSkeleton />
        </div>
      </div>
    </section>
  </WorkspacePageWrapper>
);
