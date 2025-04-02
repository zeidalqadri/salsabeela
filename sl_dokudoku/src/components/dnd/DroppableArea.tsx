import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';

interface DroppableAreaProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  data?: Record<string, any>;
  disabled?: boolean;
}

export function DroppableArea({
  id,
  children,
  className,
  data = {},
  disabled = false,
}: DroppableAreaProps) {
  const { isOver, setNodeRef } = useDroppable({
    id,
    data,
    disabled,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'transition-colors duration-200',
        isOver && !disabled && 'bg-accent/50 ring-2 ring-primary/20',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {children}
    </div>
  );
} 