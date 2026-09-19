import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type AppPageContainerProps = {
  children: ReactNode;
  contentClassName?: string;
  id?: string;
  sectionClassName?: string;
};

export const AppPageContainer = ({ children, contentClassName, id, sectionClassName }: AppPageContainerProps) => {
  return (
    <section id={id} className={sectionClassName}>
      <div className={cn('mx-auto flex max-w-[1320px] flex-col gap-8 px-4 py-16', contentClassName)}>{children}</div>
    </section>
  );
};
