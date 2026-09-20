import { ArticlesSkeletonBlock } from '@/components/common/ArticlesSkeletonBlock';

export const ArticlesCategoryPaneSkeleton = () => (
  <aside className="border-b border-border p-5 lg:h-full lg:border-b-0 lg:border-r">
    <ArticlesSkeletonBlock width="7rem" height="1.75rem" className="bg-primary/15" />
    <ArticlesSkeletonBlock width="5rem" height="1rem" className="mt-4" />
    <ArticlesSkeletonBlock height="2.75rem" className="mt-2 lg:hidden" />
    <ArticlesSkeletonBlock height="2.25rem" className="mt-4 hidden lg:block" />
    <ArticlesSkeletonBlock height="2.25rem" className="mt-3 hidden lg:block" />
  </aside>
);
