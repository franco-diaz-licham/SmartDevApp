import { Outlet } from 'react-router-dom';
import { WorkspaceTopBar } from '@/components/common/WorkspaceTopBar';
import { ScrollToTop } from './ScrollToTop';

export const WorkspaceLayout = () => {
  return (
    <>
      <ScrollToTop />
      <WorkspaceTopBar />
      <Outlet />
    </>
  );
};
