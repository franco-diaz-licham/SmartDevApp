import portfolioHeroImage from '@/assets/images/portfolio.png';
import { AppHero } from '@/components/common/AppHero';

type PortfolioHeroProps = {
  subtitle: string;
  title: string;
};

export const PortfolioHero = ({ subtitle, title }: PortfolioHeroProps) => {
  return <AppHero backgroundImage={portfolioHeroImage} id="portfolio-hero" subtitle={subtitle} title={title} />;
};
