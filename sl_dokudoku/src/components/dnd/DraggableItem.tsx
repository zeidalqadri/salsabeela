import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';

interface DraggableItemProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  dragOverlay?: boolean;
  data?: Record<string, any>;
  disabled?: boolean;
}

export function DraggableItem({
  id,
  children,
  className,
  dragOverlay = false,
  data = {},
  disabled = false,
}: DraggableItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    data,
    disabled,
  });
  
  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging && !dragOverlay ? 0.5 : undefined,
    cursor: disabled ? 'default' : 'grab',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'touch-manipulation',
        isDragging && 'relative z-10',
        className
      )}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
} 