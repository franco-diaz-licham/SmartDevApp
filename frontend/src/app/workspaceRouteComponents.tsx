import { lazy, Suspense } from 'react';
import { NoteArticlePageSkeleton } from '@/features/notes/components/NoteArticlePageSkeleton';
import { NotesPageSkeleton } from '@/features/notes/components/NotesPageSkeleton';

const LazyNotesPage = lazy(() => import('@/features/notes/pages/NotesPage').then((module) => ({ default: module.NotesPage })));
const LazyNoteArticlePage = lazy(() => import('@/features/notes/pages/NoteArticlePage').then((module) => ({ default: module.NoteArticlePage })));

export const NotesPageRoute = () => (
  <Suspense fallback={<NotesPageSkeleton />}>
    <LazyNotesPage />
  </Suspense>
);

export const NoteArticlePageRoute = () => (
  <Suspense fallback={<NoteArticlePageSkeleton />}>
    <LazyNoteArticlePage />
  </Suspense>
);
