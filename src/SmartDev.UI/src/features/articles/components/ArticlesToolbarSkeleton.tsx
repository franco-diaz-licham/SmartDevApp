import { ArticlesSkeletonBlock } from '@/components/common/ArticlesSkeletonBlock';

export const ArticlesToolbarSkeleton = () => (
  <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_8rem] sm:items-end">
    <ArticlesSkeletonBlock height="3rem" />
    <ArticlesSkeletonBlock height="3rem" className="hidden sm:block" />
  </div>
);
