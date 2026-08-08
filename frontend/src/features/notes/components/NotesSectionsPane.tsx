import type { NoteSectionModel } from '../utils/noteContent';

interface NotesSectionsPaneProps {
  sections: NoteSectionModel[];
}

export const NotesSectionsPane = ({ sections }: NotesSectionsPaneProps) => (
  <aside className="hidden px-6 py-8 xl:sticky xl:top-[5.5rem] xl:block xl:h-[calc(100vh-5.5rem)] xl:overflow-y-auto xl:border-l">
    <p className="text-sm font-extrabold">On this note</p>
    <nav className="mt-4 space-y-1" aria-label="Selected note sections">
      {sections.map((section) => (
        <a key={section.id} className={`block truncate py-1.5 text-sm text-muted-foreground no-underline hover:text-primary ${section.level > 2 ? 'pl-4' : ''}`} href={`#${section.id}`}>
          {section.title}
        </a>
      ))}
    </nav>
  </aside>
);
