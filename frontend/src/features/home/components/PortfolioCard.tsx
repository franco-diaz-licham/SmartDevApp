type PortfolioCardProps = {
  description: string;
  image: string;
  imageAlt: string;
  title: string;
};

export const PortfolioCard = ({ description, image, imageAlt, title }: PortfolioCardProps) => {
  return (
    <article className="grid h-[27.75rem] overflow-hidden rounded-md border border-black/20 shadow-[0_10px_15px_rgb(160_160_160_/_0.75)] transition hover:cursor-pointer">
      <div className="h-[16.25rem] overflow-hidden bg-background">
        <img src={image} className="h-full w-full object-contain transition duration-500 ease-in hover:scale-110 hover:opacity-70" alt={imageAlt} />
      </div>
      <div className="bg-card p-4 transition hover:bg-accent/40 h-[11.5rem]">
        <h5 className="text-[1.25rem] font-bold uppercase leading-tight text-secondary">{title}</h5>
        <p>{description}</p>
      </div>
    </article>
  );
};
