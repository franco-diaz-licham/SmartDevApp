import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RequireAuth, LoginPage } from '@/features/auth';
import { ArticleDetailsPageSkeleton } from '@/features/articles/components/ArticleDetailsPageSkeleton';
import { HomePage } from '@/features/home/pages/HomePage';
import { PersonalProjectPage } from '@/features/portfolio/pages/PersonalProjectPage';
import { ProfessionalWorkPage } from '@/features/portfolio/pages/ProfessionalWorkPage';
import { AppShell } from '@/layouts/AppShell';
import { WorkspaceLayout } from '@/layouts/WorkspaceLayout';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { ArticleDetailsPageRoute, ArticlesPageRoute } from './workspaceRouteComponents';

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
      { path: '/workspace', element: <ArticlesPageRoute /> },
      { path: '/articles', element: <Navigate to="/workspace" replace /> },
      { path: '/workspace/articles/:articleId', element: <ArticleDetailsPageRoute /> },
      {
        element: <RequireAuth fallback={<ArticleDetailsPageSkeleton />} />,
        children: [{ path: '/workspace/articles/new', element: <ArticleDetailsPageRoute /> }]
      }
    ]
  },
  { path: '*', element: <NotFoundPage /> }
]);
