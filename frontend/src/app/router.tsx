import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RequireAuth, LoginPage } from '@/features/auth';
import { HomePage } from '@/features/home/pages/HomePage';
import { CreateNotePage } from '@/features/notes/pages/CreateNotePage';
import { NoteArticlePage } from '@/features/notes/pages/NoteArticlePage';
import { NotesPage } from '@/features/notes/pages/NotesPage';
import { PersonalProjectPage } from '@/features/portfolio/pages/PersonalProjectPage';
import { ProfessionalWorkPage } from '@/features/portfolio/pages/ProfessionalWorkPage';
import { AppShell } from '@/layouts/AppShell';
import { WorkspaceLayout } from '@/layouts/WorkspaceLayout';
import { AdminHomePage } from '@/pages/AdminHomePage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/home" replace /> },
      { path: 'home', element: <HomePage /> },
      { path: 'notes/:slug/read', element: <NoteArticlePage /> },
      { path: 'portfolio/professional/:itemId', element: <ProfessionalWorkPage /> },
      { path: 'portfolio/personal/:itemId', element: <PersonalProjectPage /> }
    ]
  },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <WorkspaceLayout />,
        children: [
          { path: '/admin', element: <AdminHomePage /> },
          { path: '/workspace', element: <NotesPage /> },
          { path: '/workspace/notes/new', element: <CreateNotePage /> },
          { path: '/workspace/notes/:noteId', element: <NoteArticlePage /> },
          { path: '/workspace/notes/:noteId/read', element: <NoteArticlePage /> },
          { path: '/workspace/notes/:noteId/edit', element: <NoteArticlePage /> },
          { path: '/notes', element: <Navigate to="/workspace" replace /> }
        ]
      }
    ]
  },
  { path: '*', element: <NotFoundPage /> }
]);
