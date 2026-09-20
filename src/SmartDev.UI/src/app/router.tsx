import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RequireAuth, LoginPage } from '@/features/auth';
import { ArticleDetailsPageSkeleton } from '@/features/articles/components/ArticleDetailsPageSkeleton';
import { HomePage } from '@/features/home/pages/HomePage';
import { PersonalProjectPage } from '@/features/portfolio/pages/PersonalProjectPage';
import { ProfessionalWorkPage } from '@/features/portfolio/pages/ProfessionalWorkPage';
import { AppShell } from '@/layouts/AppShell';
import { WorkspaceLayout } from '@/layouts/WorkspaceLayout';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { ArticleDetailsPageRoute, ArticlesPageRoute, JournalEntryPageRoute, JournalPageRoute } from './workspaceRouteComponents';

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
      { path: '/articles', element: <ArticlesPageRoute /> },
      { path: '/articles/:articleId', element: <ArticleDetailsPageRoute /> },
      {
        element: <RequireAuth fallback={<ArticleDetailsPageSkeleton />} />,
        children: [
          { path: '/articles/new', element: <ArticleDetailsPageRoute /> },
          { path: '/journal', element: <JournalPageRoute /> },
          { path: '/journal/new', element: <JournalEntryPageRoute /> },
          { path: '/journal/:entryId', element: <JournalEntryPageRoute /> }
        ]
      }
    ]
  },
  { path: '*', element: <NotFoundPage /> }
]);
