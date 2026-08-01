import heroImage from '@/assets/images/hero.png';
import { AppHero } from '@/components/common/AppHero';
import { AboutMe } from '../components/AboutMe';
import { Contact } from '../components/Contact';
import { Experience } from '../components/Experience';
import { Portfolio } from '../components/Portfolio';

export const HomePage = () => {
  return (
    <main>
      <AppHero backgroundImage={heroImage} subtitle="SmartDev: Smart Software Made Simple" title={'Franco Diaz\nFull-Stack Developer'} />
      <AboutMe />
      <Experience />
      <Portfolio />
      <Contact />
    </main>
  );
};
