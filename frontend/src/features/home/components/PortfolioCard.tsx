type PortfolioCardProps = {
  description: string;
  image: string;
  imageAlt: string;
  title: string;
};

export const PortfolioCard = ({ description, image, imageAlt, title }: PortfolioCardProps) => {
  return (
    <article className="grid h-[27.75rem] overflow-hidden rounded-md border border-border shadow-lg">
      <div className="h-[16.25rem] overflow-hidden bg-background">
        <img src={image} className="h-full w-full object-contain transition duration-500 ease-in hover:scale-110 hover:opacity-70" alt={imageAlt} />
      </div>
      <div className="h-[11.5rem] bg-card p-4 hover:bg-accent/40">
        <h5 className="text-lg font-bold uppercase leading-tight text-secondary sm:text-xl">{title}</h5>
        <p>{description}</p>
      </div>
    </article>
  );
};
