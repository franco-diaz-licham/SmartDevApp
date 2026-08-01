import { portfolioGroups } from '../data/homeContent';

export const Portfolio = () => {
  return (
    <section id="portfolio" className="mx-auto my-16 max-w-[1320px] scroll-mt-32 px-4">
      <h1 className="pb-4">Portfolio</h1>
      <p className="pb-4">
        Here, you'll find a selection of my work that demonstrates my experience in designing, building, and delivering software solutions. From web applications to custom systems, each project represents my focus on clean architecture,
        problem-solving, and user-centered design. Feel free to explore, and reach out if you'd like to connect or collaborate.
      </p>
      <div className="grid gap-10">
        {portfolioGroups.map((group) => (
          <section key={group.title}>
            <h3 className="mb-4 text-[1.75rem] font-bold leading-tight">{group.title}</h3>
            <div className="flex flex-wrap justify-center gap-12">
              {group.items.map((item) => (
                <article className="w-full max-w-[540px] overflow-hidden rounded-md border border-black/20 bg-card shadow-[0_10px_15px_rgb(160_160_160_/_0.75)] transition hover:cursor-pointer hover:bg-accent/40 max-sm:max-w-[340px]" key={item.title}>
                  <div className="max-h-[60%] overflow-hidden">
                    <img src={item.image} className="h-full w-full object-cover transition duration-500 ease-in hover:scale-110 hover:opacity-70" alt={item.imageAlt} />
                  </div>
                  <div className="p-4">
                    <h5 className="font-bold">{item.title}</h5>
                    <p>{item.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
};
