import type { ReactNode } from 'react';
import clsx from 'clsx'; // Assuming clsx or a similar utility is available for class merging

interface CardProps {
  children: ReactNode;
  className?: string; // Add optional className prop
}

export function Card({ children, className }: CardProps) {
  return (
    // Merge base classes with the provided className
    <div className={clsx(
      "bg-white rounded-3xl shadow-sm overflow-hidden p-6 md:p-8 border border-gray-100", 
      className // Append the optional className
    )}>
      {children}
    </div>
  );
} 