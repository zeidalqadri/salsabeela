import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { TagBadgeProps } from '@/types/tag';

export function TagBadge({ tag, className, onClick }: TagBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'cursor-pointer hover:opacity-80 transition-opacity',
        className
      )}
      style={{ backgroundColor: tag.color, color: getContrastColor(tag.color) }}
      onClick={onClick}
    >
      {tag.name}
    </Badge>
  );
}

// Helper function to determine text color based on background color
function getContrastColor(hexColor: string): string {
  // Remove the hash if it exists
  const color = hexColor.replace('#', '');
  
  // Convert hex to RGB
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);
  
  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return black or white based on luminance
  return luminance > 0.5 ? '#000000' : '#ffffff';
} 