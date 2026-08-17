import { WorkspaceSkeletonBlock } from '@/components/common/WorkspaceSkeletonBlock';

export const ArticlesCategoryPaneSkeleton = () => (
  <aside className="hidden h-full min-h-0 overflow-hidden border-r border-border px-5 py-6 lg:block xl:px-6">
    <WorkspaceSkeletonBlock width="7rem" height="0.75rem" className="bg-primary/15" />
    <WorkspaceSkeletonBlock width="11rem" height="2rem" className="mt-4" />
    <WorkspaceSkeletonBlock width="8rem" height="1rem" className="mt-10" />
    <WorkspaceSkeletonBlock height="2.25rem" className="mt-4" />
    <WorkspaceSkeletonBlock height="2.25rem" className="mt-3" />
    <WorkspaceSkeletonBlock height="2.25rem" className="mt-3" />
  </aside>
);
