import { ArticlesSkeletonBlock } from '@/components/common/ArticlesSkeletonBlock';

export const JournalListSkeleton = () => (
  <div className="grid gap-3">
    {Array.from({ length: 4 }, (_, index) => (
      <div key={index} className="rounded-md border border-border p-4">
        <ArticlesSkeletonBlock className="h-4 w-36" />
        <ArticlesSkeletonBlock className="mt-3 h-6 w-3/4" />
        <ArticlesSkeletonBlock className="mt-3 h-4 w-full" />
      </div>
    ))}
  </div>
);
