import { useState } from 'react';
import UilBars from '@iconscout/react-unicons/icons/uil-bars';
import UilTimes from '@iconscout/react-unicons/icons/uil-times';
import logoImage from '@/assets/images/logo.png';
import { useAuth } from '@/features/auth';

const navigationItems = [
  { label: 'HOME', href: '/home#hero', visibility: 'always' },
  { label: 'ABOUT ME', href: '/home#about-me', visibility: 'always' },
  { label: 'EXPERIENCE', href: '/home#services', visibility: 'always' },
  { label: 'PORTFOLIO', href: '/home#portfolio', visibility: 'always' },
  { label: 'CONTACT ME', href: '/home#contact-me', visibility: 'always' },
  { label: 'WORKSPACE', href: '/workspace', visibility: 'authenticated' },
  { label: 'LOGIN', href: '/login?returnTo=%2Fworkspace', visibility: 'anonymous' },
  { label: 'LOG OUT', href: '', visibility: 'authenticated' }
] as const;

export const AppTopBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthReady, isMasqueradingAsPublic, isPublicView, isSignedIn, interactionInProgress, logout, startPublicMasquerade, stopPublicMasquerade } = useAuth();

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    closeMenu();
    void logout();
  };

  const handlePublicViewToggle = () => {
    closeMenu();
    if (isMasqueradingAsPublic) stopPublicMasquerade();
    else startPublicMasquerade();
  };

  const visibleNavigationItems = navigationItems.filter((item) => item.visibility === 'always' || (isAuthReady && (item.visibility === 'authenticated' ? !isPublicView : isPublicView)));

  return (
    <header className="sticky top-0 z-50 bg-muted">
      <nav className="mx-auto flex max-w-[1920px] flex-wrap items-center px-4 py-2">
        <a className="mr-auto py-[0.3125rem] pl-4 no-underline" href="/" aria-label="SmartDev home">
          <img src={logoImage} className="size-[4.5rem]" alt="" />
        </a>

        <button aria-controls="site-navigation" aria-expanded={isMenuOpen} aria-label="Toggle navigation" className="mx-4 rounded border border-border p-2 lg:hidden" type="button" onClick={() => setIsMenuOpen((current) => !current)}>
          {isMenuOpen ? <UilTimes size="1.5rem" /> : <UilBars size="1.5rem" />}
        </button>

        <ul id="site-navigation" className={`ml-4 basis-full flex-col gap-y-2 pt-3 font-bold lg:flex lg:basis-auto lg:flex-row lg:justify-end lg:gap-x-6 lg:pt-0 ${isMenuOpen ? 'flex' : 'hidden'}`}>
          {visibleNavigationItems.map((item) => (
            <li key={item.label}>
              {item.href ? (
                <a className="block py-2 no-underline hover:underline lg:py-0" href={item.href} onClick={closeMenu}>
                  {item.label}
                </a>
              ) : (
                <button className="block bg-transparent p-0 py-2 text-left font-bold text-current hover:underline disabled:cursor-not-allowed disabled:opacity-60 lg:py-0" type="button" disabled={interactionInProgress} onClick={handleLogout}>
                  {item.label}
                </button>
              )}
            </li>
          ))}
          {isAuthReady && isSignedIn && (
            <li>
              <button className="block bg-transparent p-0 py-2 text-left font-bold text-current hover:underline lg:py-0" type="button" onClick={handlePublicViewToggle}>
                {isMasqueradingAsPublic ? 'EXIT PUBLIC VIEW' : 'PREVIEW PUBLIC VIEW'}
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};
