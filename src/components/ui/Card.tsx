import { HTMLAttributes } from 'react';
import { cn } from '../../utils/utils';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-xl border border-gray-800 bg-gray-900/50 text-gray-100 shadow-sm backdrop-blur-sm", className)}
      {...props}
    />
  );
}
