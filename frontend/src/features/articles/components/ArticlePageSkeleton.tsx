import { WorkspacePageWrapper } from '@/components/common/WorkspacePageWrapper';
import { ArticleContentSkeleton } from './ArticleContentSkeleton';
import { ArticleMetadataSkeleton } from './ArticleMetadataSkeleton';
import { ArticleSectionsPaneSkeleton } from './ArticleSectionsPaneSkeleton';

export const ArticlePageSkeleton = () => (
  <WorkspacePageWrapper>
    <div className="mx-auto h-full max-w-[1560px] overflow-y-auto lg:grid lg:grid-cols-[1fr_18rem] lg:overflow-hidden xl:grid-cols-[17rem_1fr_18rem]" role="status" aria-label="Loading article">
      <ArticleSectionsPaneSkeleton />
      <article className="min-w-0 px-5 py-7 sm:px-8 lg:min-h-0 lg:overflow-hidden lg:px-10">
        <ArticleContentSkeleton />
      </article>
      <ArticleMetadataSkeleton />
    </div>
  </WorkspacePageWrapper>
);
