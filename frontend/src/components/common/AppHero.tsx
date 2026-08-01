type AppHeroProps = {
  backgroundImage: string;
  id?: string;
  subtitle: string;
  title: string;
};

export const AppHero = ({ backgroundImage, id = 'hero', subtitle, title }: AppHeroProps) => {
  return (
    <section
      id={id}
      className="relative h-[70vh] bg-primary bg-cover bg-center text-primary-foreground"
      style={{
        backgroundImage: `linear-gradient(rgba(110, 0, 110, 0.8), rgba(0, 68, 255, 0.8)), url(${backgroundImage})`
      }}
    >
      <div className="relative mx-auto h-full max-w-[1320px] px-4">
        <div className="absolute top-[30%]">
          <h1 className="mb-4 whitespace-pre-line text-left text-[4rem] font-bold uppercase leading-[1.2] text-primary-foreground max-sm:text-[3rem]">{title}</h1>
          <h5 className="text-[1.25rem] font-medium uppercase text-primary-foreground">{subtitle}</h5>
        </div>
      </div>
    </section>
  );
};
