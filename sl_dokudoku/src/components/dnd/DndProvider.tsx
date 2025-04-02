import React, { useState } from 'react';
import {
  DndContext as DndKitContext,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  DragCancelEvent,
  pointerWithin,
  rectIntersection,
  closestCenter,
  KeyboardSensor,
  Modifier,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

interface DndContextProps {
  children: React.ReactNode;
  onDragStart?: (event: DragStartEvent) => void;
  onDragEnd?: (event: DragEndEvent) => void;
  onDragOver?: (event: DragOverEvent) => void;
  onDragCancel?: (event: DragCancelEvent) => void;
  modifiers?: Modifier[];
  id?: string;
}

export function DndProvider({
  children,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragCancel,
  modifiers = [restrictToWindowEdges],
  id = 'root',
}: DndContextProps) {
  // Track active item to render in drag overlay
  const [activeId, setActiveId] = useState<string | null>(null);
  
  // Configure sensors for mouse/touch and keyboard navigation
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require a drag of at least 8px to start
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag start event
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    onDragStart?.(event);
  };

  // Handle drag end event
  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    onDragEnd?.(event);
  };

  // Handle drag cancel event
  const handleDragCancel = (event: DragCancelEvent) => {
    setActiveId(null);
    onDragCancel?.(event);
  };

  return (
    <DndKitContext
      id={id}
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={modifiers}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      onDragOver={onDragOver}
    >
      {children}
    </DndKitContext>
  );
} 