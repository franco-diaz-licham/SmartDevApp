import type { NoteSectionModel } from '../utils/noteContent';

interface NotesSectionsPaneProps {
  sections: NoteSectionModel[];
}

const getSectionClassName = (level: number) => {
  const levelClassName =
    {
      1: 'pl-0 font-semibold text-foreground',
      2: 'pl-4',
      3: 'pl-8',
      4: 'pl-12'
    }[level] ?? 'pl-12';

  return `block truncate py-1.5 text-sm text-muted-foreground no-underline transition hover:text-primary ${levelClassName}`;
};

export const NotesSectionsPane = ({ sections }: NotesSectionsPaneProps) => (
  <aside className="hidden min-h-0 overflow-y-auto px-6 py-8 xl:block xl:border-r">
    <h2 className="text-lg font-extrabold">Table of Content</h2>
    <nav className="mt-4 space-y-1" aria-label="Article structure">
      {sections.length > 0 ? (
        sections.map((section) => (
          <a key={section.id} className={getSectionClassName(section.level)} href={`#${section.id}`}>
            {section.title}
          </a>
        ))
      ) : (
        <p className="text-sm text-muted-foreground">No sections yet.</p>
      )}
    </nav>
  </aside>
);
