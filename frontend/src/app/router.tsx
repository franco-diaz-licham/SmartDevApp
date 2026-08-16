import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RequireAuth, LoginPage } from '@/features/auth';
import { HomePage } from '@/features/home/pages/HomePage';
import { NoteArticlePage } from '@/features/notes/pages/NoteArticlePage';
import { NotesPage } from '@/features/notes/pages/NotesPage';
import { PersonalProjectPage } from '@/features/portfolio/pages/PersonalProjectPage';
import { ProfessionalWorkPage } from '@/features/portfolio/pages/ProfessionalWorkPage';
import { AppShell } from '@/layouts/AppShell';
import { WorkspaceLayout } from '@/layouts/WorkspaceLayout';
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
      { path: 'portfolio/professional/:itemId', element: <ProfessionalWorkPage /> },
      { path: 'portfolio/personal/:itemId', element: <PersonalProjectPage /> }
    ]
  },
  {
    element: <WorkspaceLayout />,
    children: [
      { path: '/workspace', element: <NotesPage /> },
      { path: '/notes', element: <Navigate to="/workspace" replace /> },
      { path: '/workspace/notes/:noteId', element: <NoteArticlePage /> },
      {
        element: <RequireAuth />,
        children: [{ path: '/workspace/notes/new', element: <NoteArticlePage /> }]
      }
    ]
  },
  { path: '*', element: <NotFoundPage /> }
]);
