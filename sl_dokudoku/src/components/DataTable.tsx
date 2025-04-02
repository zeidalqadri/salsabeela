'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  RowSelectionState,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, FolderPlus, Tag as TagIcon } from 'lucide-react';
import type { DataTableProps } from '@/types/datatable';
import { TagBadge } from '@/components/TagBadge';
import { formatDate, formatFileSize } from '@/lib/utils';
import { useBatchMoveDocuments, useBatchTagDocuments, useBatchDeleteDocuments } from '@/hooks/useBatchOperations';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { BatchMoveModal } from '@/components/BatchMoveModal';
import { BatchTagModal } from '@/components/BatchTagModal';

export function DataTable<T extends { id: string }>({
  data,
  columns,
  pagination,
  sorting,
  onPaginationChange,
  onSortingChange,
  isLoading,
  selectedRows,
  onRowSelection
}: DataTableProps<T>) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [batchMoveOpen, setBatchMoveOpen] = useState(false);
  const [batchTagOpen, setBatchTagOpen] = useState(false);
  
  const batchDeleteMutation = useBatchDeleteDocuments();
  const batchMoveMutation = useBatchMoveDocuments();
  const batchTagMutation = useBatchTagDocuments();

  const selectionColumn: ColumnDef<T, any> = {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  };

  const table = useReactTable({
    data,
    columns: [selectionColumn, ...columns],
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    manualPagination: true,
    manualSorting: true,
    pageCount: pagination?.totalPages ?? -1,
    state: {
      rowSelection,
      sorting: sorting ? [{ id: sorting.field, desc: sorting.direction === 'desc' }] : [],
    },
  });

  const selectedRowIds = table.getSelectedRowModel().rows.map(row => row.original.id);

  const handleBatchDelete = async () => {
    if (selectedRowIds.length === 0) return;
    
    batchDeleteMutation.mutate(selectedRowIds, {
      onSuccess: () => {
        setRowSelection({});
      }
    });
  };

  return (
    <div className="space-y-4">
      {selectedRowIds.length > 0 && (
        <div className="flex items-center gap-2 p-2 border rounded bg-muted">
          <span className="text-sm text-muted-foreground">{selectedRowIds.length} selected</span>
          
          <Dialog open={batchMoveOpen} onOpenChange={setBatchMoveOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <FolderPlus className="h-4 w-4 mr-1" />
                Move
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Move Documents</DialogTitle>
                <DialogDescription>
                  Select a folder to move the selected documents to
                </DialogDescription>
              </DialogHeader>
              <BatchMoveModal 
                documentIds={selectedRowIds} 
                onComplete={() => {
                  setBatchMoveOpen(false);
                  setRowSelection({});
                }}
              />
            </DialogContent>
          </Dialog>
          
          <Dialog open={batchTagOpen} onOpenChange={setBatchTagOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <TagIcon className="h-4 w-4 mr-1" />
                Tag
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tag Documents</DialogTitle>
                <DialogDescription>
                  Select tags to apply to the selected documents
                </DialogDescription>
              </DialogHeader>
              <BatchTagModal 
                documentIds={selectedRowIds} 
                onComplete={() => {
                  setBatchTagOpen(false);
                  setRowSelection({});
                }}
              />
            </DialogContent>
          </Dialog>
          
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={handleBatchDelete}
            disabled={batchDeleteMutation.isPending}
          >
            {batchDeleteMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
            ) : null}
            Delete
          </Button>
        </div>
      )}

      <div className="rounded-md border relative">
        {isLoading && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={header.column.getCanSort() ? 'cursor-pointer select-none' : ''}
                    onClick={() => {
                      if (header.column.getCanSort() && sorting) {
                        sorting.onSort(header.column.id);
                      }
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      {header.column.getCanSort() && sorting?.field === header.column.id && (
                        <span className="text-xs">
                          {sorting.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="h-24 text-center"
                >
                  {isLoading ? 'Loading...' : 'No results.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <span>·</span>
            <span>
              Total {pagination.total} items
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1 || isLoading}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages || isLoading}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 