interface NotesCategoryPaneProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const NotesCategoryPane = ({ categories, selectedCategory, onSelectCategory }: NotesCategoryPaneProps) => (
  <aside className="h-full min-h-0 overflow-y-auto border-b border-border px-5 py-6 lg:border-b-0 lg:border-r xl:px-6">
    <p className="text-xs font-extrabold uppercase text-primary">Workspace notes</p>
    <h1 className="mt-2 text-2xl font-extrabold leading-tight">Knowledge Base</h1>

    <nav className="mt-8" aria-label="Note categories">
      <p className="mb-3 text-sm font-extrabold">Categories</p>
      <div className="space-y-1">
        {categories.map((category) => {
          const isSelected = selectedCategory === category;

          return (
            <button
              key={category}
              className={`block w-full rounded-md px-3 py-2 text-left text-sm font-bold transition hover:bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 ${isSelected ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground'}`}
              type="button"
              onClick={() => onSelectCategory(category)}
            >
              {category}
            </button>
          );
        })}
      </div>
    </nav>
  </aside>
);
