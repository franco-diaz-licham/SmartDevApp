import { AboutMe } from '../components/AboutMe';
import { Contact } from '../components/Contact';
import { Experience } from '../components/Experience';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { Portfolio } from '../components/Portfolio';

export const HomePage = () => {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <AboutMe />
        <Experience />
        <Portfolio />
        <Contact />
      </main>
      <Footer />
    </>
  );
};
