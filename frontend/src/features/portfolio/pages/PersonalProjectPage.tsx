import { Navigate, useParams } from 'react-router-dom';
import { SkillsCard } from '@/components/common/SkillsCard';
import { PortfolioHero } from '../components/PortfolioHero';
import { PortfolioSection } from '../components/PortfolioSection';
import { WorkSummary } from '../components/WorkSummary';
import { personalProjectItems } from '../data/portfolioData';

const buildDemoUrl = (demoUrl: string) => {
  const url = new URL(demoUrl);
  if (url.hostname.includes('youtube.com')) {
    url.searchParams.set('origin', window.location.origin);
  }
  return url.toString();
};

export const PersonalProjectPage = () => {
  const { itemId } = useParams();
  const item = personalProjectItems.find((projectItem) => projectItem.id === itemId);

  if (!item) return <Navigate to="/home#portfolio" replace />;

  return (
    <main>
      <PortfolioHero subtitle={item.subtitle} title={item.projectName} />
      <PortfolioSection title="The Project">
        <WorkSummary image={item.image} imageAlt={`${item.projectName} logo`} summary={item.overview} />
      </PortfolioSection>
      {item.demoUrl ? (
        <section className="mx-auto max-w-[1320px] px-4 pb-16">
          <div className="aspect-video bg-footer">
            <iframe
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="h-full w-full border-0"
              referrerPolicy="strict-origin-when-cross-origin"
              src={buildDemoUrl(item.demoUrl)}
              title={`${item.projectName} demo video`}
            />
          </div>
        </section>
      ) : null}
      <PortfolioSection shaded title="Impact">
        <ul className="list-disc pl-6">
          {item.impact.map((impact) => (
            <li key={impact}>
              {impact}
            </li>
          ))}
        </ul>
      </PortfolioSection>
      <PortfolioSection title="Tech">
        <div className="grid gap-4 md:grid-cols-2">
          <SkillsCard title="Backend" value={item.tech.backend} />
          <SkillsCard title="Frontend" value={item.tech.frontend} />
          <SkillsCard title="CI/CD & Cloud" value={item.tech.cicdCloud} />
          <SkillsCard title="Architecture" value={item.tech.architecture} />
        </div>
      </PortfolioSection>
    </main>
  );
};
