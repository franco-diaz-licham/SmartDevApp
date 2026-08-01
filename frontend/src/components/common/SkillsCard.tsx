type SkillsCardProps = {
  title: string;
  value: string;
};

export const SkillsCard = ({ title, value }: SkillsCardProps) => {
  return (
    <article className="border-l-4 border-primary bg-muted px-6 py-5">
      <h5 className="mb-3 text-[1.25rem] font-bold uppercase leading-tight text-secondary">{title}</h5>
      <p className="mb-0">{value}</p>
    </article>
  );
};
