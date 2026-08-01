import type { ReactNode } from 'react';

type PortfolioSectionProps = {
  children: ReactNode;
  shaded?: boolean;
  title: string;
};

export const PortfolioSection = ({ children, shaded = false, title }: PortfolioSectionProps) => {
  const content = (
    <div className="mx-auto max-w-[1320px] px-4 py-16">
      <h1 className="mb-4 text-left text-5xl font-bold uppercase leading-[1.1]">{title}</h1>
      {children}
    </div>
  );

  if (shaded) return <section className="bg-muted">{content}</section>;

  return <section>{content}</section>;
};
