import heroImage from '@/assets/images/hero.png';

export const Hero = () => {
  return (
    <section
      id="hero"
      className="relative h-[70vh] bg-primary bg-cover bg-center text-primary-foreground"
      style={{
        backgroundImage: `linear-gradient(rgba(110, 0, 110, 0.8), rgba(0, 68, 255, 0.8)), url(${heroImage})`
      }}
    >
      <div className="relative mx-auto h-full max-w-[1320px] px-4">
        <div className="absolute top-[30%]">
          <h1 className="mb-3 text-6xl text-primary-foreground max-sm:text-5xl">
            Franco Diaz
            <br />
            Full-Stack Developer
          </h1>
          <h5 className="text-primary-foreground">SmartDev: Smart Software Made Simple</h5>
        </div>
      </div>
    </section>
  );
};
