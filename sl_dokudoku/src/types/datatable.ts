// Improved DataTable types based on observed patterns
export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface SortingState {
  field: string;
  direction: 'asc' | 'desc';
}

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  pagination: PaginationMeta;
  sorting?: SortingState;
  onPaginationChange: (page: number, pageSize: number) => void;
  onSortingChange: (sorting: SortingState) => void;
  isLoading?: boolean;
  selectedRows?: string[];
  onRowSelection?: (rows: string[]) => void;
} 