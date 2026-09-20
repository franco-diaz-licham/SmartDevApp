import { ArticlesSkeletonBlock } from '@/components/common/ArticlesSkeletonBlock';

const bodyRows = Array.from({ length: 8 }, (_, index) => index);

export const ArticleContentSkeleton = () => (
  <>
    <ArticlesSkeletonBlock width="5rem" height="0.75rem" className="bg-primary/15" />
    <ArticlesSkeletonBlock width="72%" height="2.75rem" className="mt-4" />
    <ArticlesSkeletonBlock width="92%" height="1.25rem" className="mt-8" />
    <ArticlesSkeletonBlock width="75%" height="1.25rem" className="mt-3" />

    <div className="mt-10 border-t border-border pt-8">
      {bodyRows.map((row) => (
        <ArticlesSkeletonBlock key={row} height="1rem" width={row % 3 === 2 ? '72%' : '100%'} className="mt-4 first:mt-0" />
      ))}
    </div>
  </>
);
