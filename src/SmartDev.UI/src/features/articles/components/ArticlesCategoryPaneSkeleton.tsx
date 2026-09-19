import { WorkspaceSkeletonBlock } from '@/components/common/WorkspaceSkeletonBlock';

export const ArticlesCategoryPaneSkeleton = () => (
  <aside className="border-b border-border p-5 lg:h-full lg:border-b-0 lg:border-r">
    <WorkspaceSkeletonBlock width="7rem" height="1.75rem" className="bg-primary/15" />
    <WorkspaceSkeletonBlock width="5rem" height="1rem" className="mt-4" />
    <WorkspaceSkeletonBlock height="2.75rem" className="mt-2 lg:hidden" />
    <WorkspaceSkeletonBlock height="2.25rem" className="mt-4 hidden lg:block" />
    <WorkspaceSkeletonBlock height="2.25rem" className="mt-3 hidden lg:block" />
  </aside>
);
