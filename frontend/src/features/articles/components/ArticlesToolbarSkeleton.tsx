import { WorkspaceSkeletonBlock } from '@/components/common/WorkspaceSkeletonBlock';

export const ArticlesToolbarSkeleton = () => (
  <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_8rem] sm:items-end">
    <WorkspaceSkeletonBlock height="3rem" />
    <WorkspaceSkeletonBlock height="3rem" className="hidden sm:block" />
  </div>
);
