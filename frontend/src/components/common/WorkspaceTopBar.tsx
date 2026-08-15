import { useState } from 'react';
import UilBars from '@iconscout/react-unicons/icons/uil-bars';
import UilTimes from '@iconscout/react-unicons/icons/uil-times';
import logoImage from '@/assets/images/logo.png';
import { useAuth } from '@/features/auth';

const workspaceNavigationItems = [
  { label: 'HOME', href: '/home', visibility: 'public' },
  { label: 'WORKSPACE', href: '/workspace', visibility: 'public' }
] as const;

export const WorkspaceTopBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { interactionInProgress, isAuthenticated, isAuthReady, logout } = useAuth();

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    closeMenu();
    void logout();
  };

  return (
    <header className="sticky top-0 z-50 bg-muted">
      <nav className="mx-auto flex max-w-[1920px] flex-wrap items-center px-4 py-2">
        <a className="mr-auto py-[0.3125rem] pl-4 no-underline" href="/home" aria-label="SmartDev home">
          <img src={logoImage} className="size-[4.5rem]" alt="" />
        </a>

        <button aria-controls="workspace-navigation" aria-expanded={isMenuOpen} aria-label="Toggle navigation" className="mx-4 rounded border border-border p-2 lg:hidden" type="button" onClick={() => setIsMenuOpen((current) => !current)}>
          {isMenuOpen ? <UilTimes size="1.5rem" /> : <UilBars size="1.5rem" />}
        </button>

        <ul id="workspace-navigation" className={`ml-4 basis-full flex-col gap-y-2 pt-3 font-bold lg:flex lg:basis-auto lg:flex-row lg:justify-end lg:gap-x-6 lg:pt-0 ${isMenuOpen ? 'flex' : 'hidden'}`}>
          {workspaceNavigationItems
            .filter((item) => item.visibility === 'public' || (isAuthReady && isAuthenticated))
            .map((item) => (
              <li key={item.href}>
                <a className="block py-2 no-underline hover:underline lg:py-0" href={item.href} onClick={closeMenu}>
                  {item.label}
                </a>
              </li>
            ))}

          {isAuthReady && isAuthenticated ? (
            <li>
              <button className="block bg-transparent p-0 py-2 text-left font-bold text-current hover:underline disabled:cursor-not-allowed disabled:opacity-60 lg:py-0" type="button" disabled={interactionInProgress} onClick={handleLogout}>
                LOG OUT
              </button>
            </li>
          ) : (
            <li>
              <a className="block py-2 no-underline hover:underline lg:py-0" href="/login?returnTo=%2Fworkspace" onClick={closeMenu}>
                LOGIN
              </a>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};
