type SnapshotItem = {
  label: string;
  value: string;
};

type SnapshotGridProps = {
  items: SnapshotItem[];
};

export const SnapshotGrid = ({ items }: SnapshotGridProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((item) => (
        <div className="border-l-4 border-primary bg-muted p-[1.2rem]" key={item.label}>
          <h5 className="font-bold">{item.label}</h5>
          <p className="mb-0">{item.value}</p>
        </div>
      ))}
    </div>
  );
};
