import { Link } from 'react-router-dom';
import { AppCarousel } from '@/components/common/AppCarousel';
import { AppPageContainer } from '@/components/common/AppPageContainer';
import { PortfolioCard } from './PortfolioCard';
import { portfolioGroups } from '../data/homeContent';

export const Portfolio = () => {
  return (
    <AppPageContainer id="portfolio" sectionClassName="scroll-mt-32">
      <h1 className="text-left text-3xl font-bold uppercase leading-tight sm:text-4xl md:text-5xl">Portfolio</h1>
      <p>
        Here, you'll find a selection of my work that demonstrates my experience in designing, building, and delivering software solutions. From web applications to custom systems, each project represents my focus on clean architecture,
        problem-solving, and user-centered design. Feel free to explore, and reach out if you'd like to connect or collaborate.
      </p>
      <div className="grid gap-10">
        {portfolioGroups.map((group) => (
          <section key={group.title} className="flex flex-col gap-10">
            <h3 className="text-2xl font-bold leading-tight sm:text-3xl">{group.title}</h3>
            <AppCarousel>
              {group.items.map((item) => (
                <Link className="mx-auto block h-full w-full max-w-[540px] hover:no-underline" key={item.title} to={item.href}>
                  <PortfolioCard description={item.description} image={item.image} imageAlt={item.imageAlt} title={item.title} />
                </Link>
              ))}
            </AppCarousel>
          </section>
        ))}
      </div>
    </AppPageContainer>
  );
};
