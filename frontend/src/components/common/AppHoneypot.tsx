import type { ChangeEventHandler } from 'react';

type AppHoneypotProps = {
  id: string;
  label: string;
  name: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
};

export const AppHoneypot = ({ id, label, name, value, onChange }: AppHoneypotProps) => {
  return (
    <div aria-hidden="true" className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden">
      <label htmlFor={id}>{label}</label>
      <input id={id} name={name} tabIndex={-1} value={value} autoComplete="off" onChange={onChange} />
    </div>
  );
};
