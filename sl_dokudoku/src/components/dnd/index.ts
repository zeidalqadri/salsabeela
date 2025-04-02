export { DndProvider } from './DndProvider';
export { DraggableItem } from './DraggableItem';
export { DroppableArea } from './DroppableArea';
export { DragOverlay } from './DragOverlay';

// Re-export useful hooks from dnd-kit
export {
  useDraggable,
  useDroppable,
  useDndContext,
  useDndMonitor,
} from '@dnd-kit/core';
export {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
  rectSortingStrategy,
  rectSwappingStrategy,
} from '@dnd-kit/sortable'; 