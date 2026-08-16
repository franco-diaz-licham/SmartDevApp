import { Skeleton } from 'primereact/skeleton';
import type { SkeletonProps } from '@primereact/types/primitive/skeleton';
import { cn } from '@/lib/cn';

export const WorkspaceSkeletonBlock = ({ className, ...props }: SkeletonProps) => <Skeleton animation="none" borderRadius="0.375rem" className={cn('block animate-pulse bg-muted shadow-inner', className)} {...props} />;
