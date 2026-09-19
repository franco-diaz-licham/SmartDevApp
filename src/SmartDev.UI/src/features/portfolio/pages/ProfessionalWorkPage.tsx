import { Navigate, useParams } from 'react-router-dom';
import { SkillsCard } from '@/features/portfolio/components/SkillsCard';
import { PortfolioHero } from '../components/PortfolioHero';
import { PortfolioSection } from '../components/PortfolioSection';
import { WorkSummary } from '../components/WorkSummary';
import { professionalWorkItems } from '../data/portfolioData';

export const ProfessionalWorkPage = () => {
  const { itemId } = useParams();
  const item = professionalWorkItems.find((workItem) => workItem.id === itemId);

  if (!item) return <Navigate to="/home#portfolio" replace />;

  return (
    <main>
      <PortfolioHero subtitle={item.roleTitle} title={item.companyName} />
      <PortfolioSection title="The Role">
        <WorkSummary image={item.image} imageAlt={`${item.companyName} logo`} summary={item.roleSummary} />
      </PortfolioSection>
      <PortfolioSection shaded title="Key Contributions">
        <ul className="list-disc pl-6">
          {item.keyContributions.map((contribution) => (
            <li key={contribution}>{contribution}</li>
          ))}
        </ul>
      </PortfolioSection>
      <PortfolioSection title="Skills & Practices">
        <div className="grid gap-4 md:grid-cols-2">
          <SkillsCard title="Backend" value={item.skillsAndPractices.backend} />
          <SkillsCard title="Frontend" value={item.skillsAndPractices.frontend} />
          <SkillsCard title="Cloud & Data" value={item.skillsAndPractices.cloudAndData} />
          <SkillsCard title="Engineering" value={item.skillsAndPractices.engineeringPractices} />
        </div>
      </PortfolioSection>
    </main>
  );
};
