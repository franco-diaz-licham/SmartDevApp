import { WorkspacePageWrapper } from '@/components/common/WorkspacePageWrapper';
import { ArticlesCategoryPaneSkeleton } from './ArticlesCategoryPaneSkeleton';
import { ArticlesListSkeleton } from './ArticlesListItemSkeleton';
import { ArticlesToolbarSkeleton } from './ArticlesToolbarSkeleton';

export const ArticlesPageSkeleton = () => (
  <WorkspacePageWrapper>
    <div className="mx-auto grid h-full min-h-0 max-w-[1560px] grid-cols-1 overflow-hidden lg:grid-cols-[17rem_minmax(0,1fr)]" role="status" aria-label="Loading articles">
      <ArticlesCategoryPaneSkeleton />

      <section className="h-full min-h-0 min-w-0 overflow-hidden px-5 py-6 sm:px-8 lg:px-10">
        <ArticlesToolbarSkeleton />

        <div className="mt-8 space-y-4">
          <ArticlesListSkeleton />
        </div>
      </section>
    </div>
  </WorkspacePageWrapper>
);
