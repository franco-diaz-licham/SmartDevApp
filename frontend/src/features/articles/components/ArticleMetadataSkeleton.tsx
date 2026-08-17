import { WorkspaceSkeletonBlock } from '@/components/common/WorkspaceSkeletonBlock';

export const ArticleMetadataSkeleton = () => (
  <aside className="hidden min-h-0 overflow-hidden border-l border-border px-5 py-6 xl:block">
    <WorkspaceSkeletonBlock width="8rem" height="1rem" />
    <WorkspaceSkeletonBlock height="2.5rem" className="mt-6" />
    <WorkspaceSkeletonBlock height="2.5rem" className="mt-3" />
    <WorkspaceSkeletonBlock width="65%" height="1rem" className="mt-8" />
  </aside>
);
