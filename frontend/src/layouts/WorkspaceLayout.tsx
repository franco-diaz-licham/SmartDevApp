import { Outlet } from 'react-router-dom';
import { WorkspaceTopBar } from '@/components/common/WorkspaceTopBar';
import { ScrollToTop } from './ScrollToTop';

export const WorkspaceLayout = () => {
  return (
    <div className="grid h-screen grid-rows-[auto_minmax(0,1fr)] overflow-hidden">
      <ScrollToTop />
      <WorkspaceTopBar />
      <div className="min-h-0">
        <Outlet />
      </div>
    </div>
  );
};
