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
      <h1 className="text-3xl font-bold uppercase leading-tight sm:text-4xl md:text-5xl">{title}</h1>
      {children}
    </AppPageContainer>
  );
};
