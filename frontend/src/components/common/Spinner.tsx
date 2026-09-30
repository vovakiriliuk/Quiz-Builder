import React from 'react';
import { Loader2 } from 'lucide-react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  className = '',
  label,
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div
      role="status"
      className={`flex flex-col items-center justify-center gap-3 text-indigo-600 ${className}`}
    >
      <Loader2 className={`animate-spin ${sizeClasses[size]}`} />
      {label && (
        <span className="text-sm font-medium text-slate-500">{label}</span>
      )}
      <span className="sr-only">Loading...</span>
    </div>
  );
};
