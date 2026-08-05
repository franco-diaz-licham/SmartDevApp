import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RequireAuth, LoginPage } from '@/features/auth';
import { HomePage } from '@/features/home/pages/HomePage';
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
          { path: '/notes', element: <NotesPage /> }
        ]
      }
    ]
  },
  { path: '*', element: <NotFoundPage /> }
]);
