import { experienceItems } from '../data/homeContent';

export const Experience = () => {
  return (
    <section id="services" className="scroll-mt-16 bg-muted">
      <div className="mx-auto max-w-[1320px] px-4 py-16">
        <h1 className="pb-4">Experience</h1>
        <p className="pb-4">I have end-to-end experience across the full stack.</p>
        <div className="mx-auto grid max-w-[50rem] grid-cols-[7rem_1fr] gap-x-4 gap-y-12 sm:grid-cols-[13rem_1fr]">
          {experienceItems.map((item) => (
            <div className="contents" key={item.title}>
              <div className="flex items-center justify-center">
                <img src={item.image} className="w-3/5 sm:w-2/5" alt={item.imageAlt} />
              </div>
              <div className="border-b border-foreground pb-4">
                <h5 className="font-bold">{item.title}</h5>
                <ul className="list-disc pl-6">
                  {item.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
