import { ArticlesSkeletonBlock } from '@/components/common/ArticlesSkeletonBlock';

export const ArticleMetadataSkeleton = () => (
  <aside className="border-t border-border p-5 lg:border-l lg:border-t-0">
    <ArticlesSkeletonBlock width="8rem" height="1rem" />
    <ArticlesSkeletonBlock height="2.5rem" className="mt-6" />
    <ArticlesSkeletonBlock height="2.5rem" className="mt-3" />
    <ArticlesSkeletonBlock width="65%" height="1rem" className="mt-8" />
  </aside>
);
