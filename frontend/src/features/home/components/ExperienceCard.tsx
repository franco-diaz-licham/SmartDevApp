type ExperienceCardProps = {
  image: string;
  imageAlt: string;
  points: readonly string[];
  title: string;
};

export const ExperienceCard = ({ image, imageAlt, points, title }: ExperienceCardProps) => {
  return (
    <div className="grid min-h-[12rem] grid-cols-[7rem_1fr] gap-x-4 sm:grid-cols-[13rem_1fr]">
      <div className="flex items-center justify-center">
        <img src={image} className="w-3/5 sm:w-2/5" alt={imageAlt} />
      </div>
      <div className="border-b border-foreground pb-4">
        <h5 className="font-bold uppercase text-secondary">{title}</h5>
        <ul className="list-disc pl-6">
          {points.map((point) => (
            <li key={point}>
              {point}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
