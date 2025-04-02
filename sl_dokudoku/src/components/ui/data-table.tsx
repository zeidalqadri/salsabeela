import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  OnChangeFn,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "./skeleton"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isLoading?: boolean
  pagination?: {
    pageSize: number
    pageIndex: number
    pageCount: number
    onPageChange: (page: number) => void
  }
  sorting?: {
    sorting: SortingState
    onSortingChange: OnChangeFn<SortingState>
  }
  meta?: {
    onShare?: (documentId: string) => void
  }
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  pagination,
  sorting,
  meta,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: pagination?.pageCount ?? -1,
    state: {
      pagination: pagination
        ? {
            pageIndex: pagination.pageIndex,
            pageSize: pagination.pageSize,
          }
        : undefined,
      sorting: sorting?.sorting,
    },
    onPaginationChange: pagination
      ? (updater) => {
          if (typeof updater === "function") {
            const newPagination = updater({
              pageIndex: pagination.pageIndex,
              pageSize: pagination.pageSize,
            })
            pagination.onPageChange(newPagination.pageIndex)
          }
        }
      : undefined,
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: sorting?.onSortingChange,
    meta,
  })

  if (isLoading) {
    return (
      <div className="w-full">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-16 w-full mt-2" />
        ))}
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
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
                colSpan={columns.length}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
} 