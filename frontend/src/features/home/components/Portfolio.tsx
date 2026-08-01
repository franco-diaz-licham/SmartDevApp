import { Link } from 'react-router-dom';
import { PortfolioCard } from './PortfolioCard';
import { portfolioGroups } from '../data/homeContent';

export const Portfolio = () => {
  return (
    <section id="portfolio" className="mx-auto my-16 max-w-[1320px] scroll-mt-32 px-4">
      <h1 className="pb-4 text-left text-5xl font-bold uppercase leading-[1.1]">Portfolio</h1>
      <p className="pb-4">
        Here, you'll find a selection of my work that demonstrates my experience in designing, building, and delivering software solutions. From web applications to custom systems, each project represents my focus on clean architecture,
        problem-solving, and user-centered design. Feel free to explore, and reach out if you'd like to connect or collaborate.
      </p>
      <div className="grid gap-10">
        {portfolioGroups.map((group) => (
          <section key={group.title}>
            <h3 className="mb-10 text-[1.75rem] font-bold leading-tight">{group.title}</h3>
            <div className="flex flex-wrap justify-center gap-12">
              {group.items.map((item) => (
                <Link className="w-full max-w-[540px] hover:no-underline max-sm:max-w-[340px]" key={item.title} to={item.href}>
                  <PortfolioCard description={item.description} image={item.image} imageAlt={item.imageAlt} title={item.title} />
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
};
