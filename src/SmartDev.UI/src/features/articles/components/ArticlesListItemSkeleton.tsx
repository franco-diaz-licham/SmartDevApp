import { WorkspaceSkeletonBlock } from '@/components/common/WorkspaceSkeletonBlock';

const rows = Array.from({ length: 5 }, (_, index) => index);

export const ArticlesListItemSkeleton = () => (
  <div className="rounded-md border border-border bg-muted/30 p-4">
    <WorkspaceSkeletonBlock width="35%" height="1rem" className="bg-primary/15" />
    <WorkspaceSkeletonBlock width="70%" height="1.5rem" className="mt-4" />
    <WorkspaceSkeletonBlock height="1rem" className="mt-5" />
    <WorkspaceSkeletonBlock width="85%" height="1rem" className="mt-3" />
  </div>
);

export const ArticlesListSkeleton = () => (
  <>
    {rows.map((row) => (
      <ArticlesListItemSkeleton key={row} />
    ))}
  </>
);
