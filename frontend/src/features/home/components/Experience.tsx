import { ExperienceCard } from './ExperienceCard';
import { experienceItems } from '../data/homeContent';

export const Experience = () => {
  return (
    <section id="services" className="scroll-mt-16 bg-muted">
      <div className="mx-auto max-w-[1320px] px-4 py-16">
        <h1 className="pb-6 text-left text-5xl font-bold uppercase leading-[1.1]">Experience</h1>
        <p className="pb-6">I have end-to-end experience across the full stack.</p>
        <div className="mx-auto grid max-w-[50rem] gap-y-12">
          {experienceItems.map((item) => (
            <ExperienceCard image={item.image} imageAlt={item.imageAlt} key={item.title} points={item.points} title={item.title} />
          ))}
        </div>
      </div>
    </section>
  );
};
