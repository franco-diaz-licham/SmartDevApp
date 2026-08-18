import { WorkspaceSkeletonBlock } from '@/components/common/WorkspaceSkeletonBlock';

export const ArticleMetadataSkeleton = () => (
  <aside className="border-t border-border p-5 lg:border-l lg:border-t-0">
    <WorkspaceSkeletonBlock width="8rem" height="1rem" />
    <WorkspaceSkeletonBlock height="2.5rem" className="mt-6" />
    <WorkspaceSkeletonBlock height="2.5rem" className="mt-3" />
    <WorkspaceSkeletonBlock width="65%" height="1rem" className="mt-8" />
  </aside>
);
