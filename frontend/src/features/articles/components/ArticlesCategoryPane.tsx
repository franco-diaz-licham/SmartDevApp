import { AppButtonSelect } from '@/components/ui/AppButtonSelect';

interface ArticlesCategoryPaneProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const ArticlesCategoryPane = ({ categories, selectedCategory, onSelectCategory }: ArticlesCategoryPaneProps) => (
  <aside className="h-full min-h-0 overflow-y-auto border-b border-border px-5 py-4 lg:border-b-0 lg:border-r xl:px-6">
    <h1 className="mt-2 text-2xl font-extrabold  text-primary">Articles</h1>
    <nav className="mt-8" aria-label="Article categories">
      <p className="mb-3 text-sm font-extrabold">Categories</p>
      <AppButtonSelect
        aria-label="Article categories"
        options={categories.map((category) => ({ label: category, value: category }))}
        value={selectedCategory}
        onChange={onSelectCategory}
      />
    </nav>
  </aside>
);
