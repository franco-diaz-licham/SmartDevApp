type WorkSummaryProps = {
  image: string;
  imageAlt: string;
  summary: string;
};

export const WorkSummary = ({ image, imageAlt, summary }: WorkSummaryProps) => {
  return (
    <div className="grid items-center gap-8 md:grid-cols-[14rem_1fr]">
      <div className="flex min-h-40 items-center justify-center rounded-lg border border-border bg-background p-4 shadow-md">
        <img className="max-h-32 max-w-full object-contain" src={image} alt={imageAlt} />
      </div>
      <div>
        <p className="mb-0">{summary}</p>
      </div>
    </div>
  );
};
