import type { ChangeEvent } from 'react';
import { AppButtonSelect } from '@/components/ui/AppButtonSelect';
import { AppSelect } from '@/components/ui/AppSelect';

interface ArticlesCategoryPaneProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const ArticlesCategoryPane = ({ categories, selectedCategory, onSelectCategory }: ArticlesCategoryPaneProps) => {
  const categoryOptions = categories.map((category) => ({ label: category, value: category }));

  return (
    <aside className="border-b border-border p-5 lg:h-full lg:overflow-y-auto lg:border-b-0 lg:border-r">
      <h1 className="text-2xl font-extrabold text-primary">Articles</h1>
      <nav className="mt-4 lg:hidden" aria-label="Article category filter">
        <AppSelect id="articles-category" label="Category" options={categoryOptions} value={selectedCategory} onChange={(event: ChangeEvent<HTMLSelectElement>) => onSelectCategory(event.target.value)} />
      </nav>
      <nav className="mt-8 hidden lg:block" aria-label="Article categories">
        <p className="mb-3 text-sm font-extrabold">Categories</p>
        <AppButtonSelect aria-label="Article categories" options={categoryOptions} value={selectedCategory} onChange={onSelectCategory} />
      </nav>
    </aside>
  );
};
