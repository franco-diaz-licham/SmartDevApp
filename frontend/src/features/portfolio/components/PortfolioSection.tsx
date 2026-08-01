import type { ReactNode } from 'react';
import { AppPageContainer } from '@/components/common/AppPageContainer';

type PortfolioSectionProps = {
  children: ReactNode;
  shaded?: boolean;
  title: string;
};

export const PortfolioSection = ({ children, shaded = false, title }: PortfolioSectionProps) => {
  return (
    <AppPageContainer sectionClassName={shaded ? 'bg-muted' : undefined}>
      <h1 className="text-left text-5xl font-bold uppercase leading-[1.1]">{title}</h1>
      {children}
    </AppPageContainer>
  );
};
