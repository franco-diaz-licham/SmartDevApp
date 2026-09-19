type SkillsCardProps = {
  title: string;
  value: string;
};

export const SkillsCard = ({ title, value }: SkillsCardProps) => {
  return (
    <article className="border-l-4 border-primary bg-muted px-6 py-5">
      <h5 className="mb-2 text-lg font-bold uppercase leading-tight text-secondary sm:text-xl">{title}</h5>
      <p className="mb-0">{value}</p>
    </article>
  );
};
