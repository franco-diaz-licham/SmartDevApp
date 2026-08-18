import { WorkspacePageWrapper } from '@/components/common/WorkspacePageWrapper';
import { ArticlesCategoryPaneSkeleton } from './ArticlesCategoryPaneSkeleton';
import { ArticlesListSkeleton } from './ArticlesListItemSkeleton';
import { ArticlesToolbarSkeleton } from './ArticlesToolbarSkeleton';

export const ArticlesPageSkeleton = () => (
  <WorkspacePageWrapper>
    <div className="mx-auto flex h-full max-w-[1560px] flex-col overflow-hidden lg:grid lg:grid-cols-[17rem_1fr]" role="status" aria-label="Loading articles">
      <ArticlesCategoryPaneSkeleton />

      <section className="min-h-0 min-w-0 flex-1 overflow-hidden px-5 py-6 sm:px-8 lg:px-10">
        <ArticlesToolbarSkeleton />

        <div className="mt-8 space-y-4">
          <ArticlesListSkeleton />
        </div>
      </section>
    </div>
  </WorkspacePageWrapper>
);
