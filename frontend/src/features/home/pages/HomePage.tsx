import heroImage from '@/assets/images/hero.png';
import { AppFooter } from '@/components/common/AppFooter';
import { AppHero } from '@/components/common/AppHero';
import { AppTopBar } from '@/components/common/AppTopBar';
import { AboutMe } from '../components/AboutMe';
import { Contact } from '../components/Contact';
import { Experience } from '../components/Experience';
import { Portfolio } from '../components/Portfolio';

export const HomePage = () => {
  return (
    <>
      <AppTopBar />
      <main>
        <AppHero backgroundImage={heroImage} subtitle="SmartDev: Smart Software Made Simple" title={'Franco Diaz\nFull-Stack Developer'} />
        <AboutMe />
        <Experience />
        <Portfolio />
        <Contact />
      </main>
      <AppFooter />
    </>
  );
};
