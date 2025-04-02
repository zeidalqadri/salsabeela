import { ColumnDef } from '@tanstack/react-table';
import { TagBadge } from '@/components/TagBadge';
import { formatDate } from '@/lib/utils';
import type { DocumentWithTags } from '@/types/document';

export const columns: ColumnDef<DocumentWithTags>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>
  },
  {
    accessorKey: 'tags',
    header: 'Tags',
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.tags.map(({ tag }) => (
          <TagBadge key={tag.id} tag={tag} />
        ))}
      </div>
    ),
    enableSorting: false
  },
  {
    accessorKey: 'updatedAt',
    header: 'Last Modified',
    cell: ({ row }) => formatDate(row.getValue('updatedAt'))
  },
  {
    accessorKey: 'fileSize',
    header: 'Size',
    cell: ({ row }) => {
      const size = row.getValue('fileSize') as number | null;
      if (!size) return '-';
      return formatFileSize(size);
    }
  }
];

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
} 