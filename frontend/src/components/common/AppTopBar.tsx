import { useState } from 'react';
import UilBars from '@iconscout/react-unicons/icons/uil-bars';
import UilTimes from '@iconscout/react-unicons/icons/uil-times';
import logoImage from '@/assets/images/logo.png';

const navigationItems = [
  { label: 'HOME', href: '#hero' },
  { label: 'ABOUT ME', href: '#about-me' },
  { label: 'EXPERIENCE', href: '#services' },
  { label: 'PORTFOLIO', href: '#portfolio' },
  { label: 'CONTACT', href: '#contact-me' }
] as const;

export const AppTopBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-muted">
      <nav className="mx-auto flex max-w-[1920px] flex-wrap items-center px-4 py-2">
        <a className="mr-auto py-[0.3125rem] pl-6" href="/" aria-label="SmartDev home">
          <img src={logoImage} className="size-[4.5rem]" alt="" />
        </a>

        <button aria-controls="site-navigation" aria-expanded={isMenuOpen} aria-label="Toggle navigation" className="ml-4 mr-4 rounded border border-border p-2 lg:hidden" type="button" onClick={() => setIsMenuOpen((current) => !current)}>
          {isMenuOpen ? <UilTimes size="1.5rem" /> : <UilBars size="1.5rem" />}
        </button>

        <ul id="site-navigation" className={`ml-4 basis-full flex-col gap-y-2 pt-3 font-bold lg:flex lg:basis-auto lg:flex-row lg:justify-end lg:gap-x-6 lg:pt-0 ${isMenuOpen ? 'flex' : 'hidden'}`}>
          {navigationItems.map((item) => (
            <li key={item.href}>
              <a className="block py-2 text-foreground lg:py-0" href={item.href} onClick={() => setIsMenuOpen(false)}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};
