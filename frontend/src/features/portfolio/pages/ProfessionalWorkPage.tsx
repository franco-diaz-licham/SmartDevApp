import { Navigate, useParams } from 'react-router-dom';
import { PortfolioHero } from '../components/PortfolioHero';
import { PortfolioSection } from '../components/PortfolioSection';
import { SnapshotGrid } from '../components/SnapshotGrid';
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
        <SnapshotGrid
          items={[
            { label: 'Backend', value: item.skillsAndPractices.backend },
            { label: 'Frontend', value: item.skillsAndPractices.frontend },
            { label: 'Cloud & Data', value: item.skillsAndPractices.cloudAndData },
            { label: 'Engineering', value: item.skillsAndPractices.engineeringPractices }
          ]}
        />
      </PortfolioSection>
    </main>
  );
};
