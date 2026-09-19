import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface WorkspacePageWrapperProps {
  children: ReactNode;
  className?: string;
}

export const WorkspacePageWrapper = ({ children, className }: WorkspacePageWrapperProps) => <main className={cn('h-full min-h-0 overflow-hidden bg-background text-foreground', className)}>{children}</main>;
