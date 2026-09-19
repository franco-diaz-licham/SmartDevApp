import { Outlet } from 'react-router-dom';
import { AppFooter } from '@/components/common/AppFooter';
import { AppTopBar } from '@/components/common/AppTopBar';
import { ScrollToTop } from './ScrollToTop';

export const AppShell = () => {
  return (
    <>
      <ScrollToTop />
      <AppTopBar />
      <Outlet />
      <AppFooter />
    </>
  );
};
