import React from 'react';
import { DragOverlay as DndKitDragOverlay, useDndContext } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { createPortal } from 'react-dom';

interface DragOverlayProps {
  children: React.ReactNode;
  dropAnimation?: boolean;
  modifiers?: any[];
  className?: string;
  style?: React.CSSProperties;
}

export function DragOverlay({
  children,
  dropAnimation = true,
  modifiers = [],
  className,
  style,
}: DragOverlayProps) {
  const { active } = useDndContext();
  
  // Only render the overlay when something is being dragged
  if (!active) {
    return null;
  }

  // Ensure Portal is only rendered on the client side
  if (typeof document === 'undefined') {
    return null;
  }

  const defaultDropAnimation = dropAnimation
    ? {
        duration: 250,
        easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
      }
    : undefined;

  return createPortal(
    <DndKitDragOverlay
      className={className}
      style={style}
      dropAnimation={defaultDropAnimation}
      modifiers={modifiers}
    >
      {children}
    </DndKitDragOverlay>,
    document.body
  );
} 