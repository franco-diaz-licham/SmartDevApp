import { AppPageContainer } from '@/components/common/AppPageContainer';
import { ExperienceCard } from './ExperienceCard';
import { experienceItems } from '../data/homeContent';

export const Experience = () => {
  return (
    <AppPageContainer id="services" sectionClassName="scroll-mt-16 bg-muted">
      <h1 className="text-left text-5xl font-bold uppercase leading-[1.1]">Experience</h1>
      <p>I have end-to-end experience across the full stack.</p>
      <div className="mx-auto grid max-w-[50rem] gap-y-10">
        {experienceItems.map((item) => (
          <ExperienceCard image={item.image} imageAlt={item.imageAlt} key={item.title} points={item.points} title={item.title} />
        ))}
      </div>
    </AppPageContainer>
  );
};
