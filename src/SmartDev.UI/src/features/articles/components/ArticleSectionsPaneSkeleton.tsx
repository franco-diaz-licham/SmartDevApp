import { ArticlesSkeletonBlock } from '@/components/common/ArticlesSkeletonBlock';

const navRows = Array.from({ length: 4 }, (_, index) => index);

export const ArticleSectionsPaneSkeleton = () => (
  <aside className="hidden min-h-0 overflow-hidden border-r border-border p-6 xl:block">
    <ArticlesSkeletonBlock width="7rem" height="1rem" />
    <div className="mt-6 space-y-3">
      {navRows.map((row) => (
        <ArticlesSkeletonBlock key={row} height="1.25rem" width={row === 0 ? '80%' : '65%'} />
      ))}
    </div>
  </aside>
);
