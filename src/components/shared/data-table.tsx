import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon
} from '@radix-ui/react-icons';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DataTableFilterField } from './data-table-types';
import { DataTableFilterModal } from './data-table-filter-modal';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount: number;
  filterFields?: DataTableFilterField<TData>[];
  defaultColumnFilters?: { id: string; value: string | null }[];
  pageSizeOptions?: number[];
  onPaginationChange?: (page: number, pageSize: number) => void;
  FilterControls: React.ComponentType<{
    table: any;
    columns: any[];
    onApplyFilters: () => void;
    onClearFilters: () => void;
  }>;
};

// Add these translations
const ptPTTranslations = {
  rowsPerPage: 'Linhas por página',
  of: 'de',
  page: 'Página',
  noResults: 'Sem resultados.',
  rowsSelected: 'linha(s) selecionada(s).',
  goToFirstPage: 'Ir para primeira página',
  goToPreviousPage: 'Ir para página anterior',
  goToNextPage: 'Ir para próxima página',
  goToLastPage: 'Ir para última página'
};

// Add this near the top of the file, before the DataTable component
const FILTER_VISIBILITY_KEY = 'data-table-filter-visibility';

export default function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  filterFields = [],
  defaultColumnFilters = [],
  pageSizeOptions = [10, 20, 30, 40, 50],
  onPaginationChange,
  FilterControls
}: DataTableProps<TData, TValue>) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Search params initialization
  const page = searchParams?.get('page') ?? '1';
  const pageAsNumber = Number(page);
  const fallbackPage =
    isNaN(pageAsNumber) || pageAsNumber < 1 ? 1 : pageAsNumber;
  const per_page = searchParams?.get('limit') ?? '10';
  const perPageAsNumber = Number(per_page);
  const fallbackPerPage = isNaN(perPageAsNumber) ? 10 : perPageAsNumber;

  // Handle server-side pagination
  const [{ pageIndex, pageSize }, setPagination] = React.useState({
    pageIndex: fallbackPage - 1,
    pageSize: fallbackPerPage
  });

  // Initialize filters from URL params
  const initialFilters = React.useMemo(() => {
    const filters: ColumnFiltersState = [];
    filterFields.forEach((field) => {
      const value = searchParams.get(field.value.toString());
      if (value) {
        filters.push({ id: field.value.toString(), value });
      }
    });
    return filters;
  }, []);

  const [columnFilters, setColumnFilters] =
    useState<ColumnFiltersState>(initialFilters);
  const [pendingColumnFilters, setPendingColumnFilters] =
    useState<ColumnFiltersState>(initialFilters);

  const handleApplyFilters = React.useCallback(() => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', '1');
    newParams.set('limit', pageSize.toString());

    filterFields.forEach((field) => {
      newParams.delete(field.value.toString());
    });

    pendingColumnFilters.forEach((filter) => {
      if (filter.value) {
        newParams.set(filter.id, filter.value.toString());
      }
    });

    setSearchParams(newParams);
    setColumnFilters(pendingColumnFilters);
  }, [
    pendingColumnFilters,
    pageSize,
    searchParams,
    setSearchParams,
    filterFields
  ]);

  // Update filters when URL params change
  useEffect(() => {
    const newFilters: ColumnFiltersState = [];
    filterFields.forEach((field) => {
      const value = searchParams.get(field.value.toString());
      if (value) {
        newFilters.push({ id: field.value.toString(), value });
      }
    });
    setPendingColumnFilters(newFilters);
    setColumnFilters(newFilters);
  }, [searchParams, filterFields]);

  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount ?? -1,
    state: {
      pagination: { pageIndex, pageSize },
      columnFilters: pendingColumnFilters
    },
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const newState = updater({
          pageIndex,
          pageSize
        });

        // Update URL params with new pagination state
        const newParams = new URLSearchParams(searchParams);
        newParams.set('page', (newState.pageIndex + 1).toString());
        newParams.set('limit', newState.pageSize.toString());
        setSearchParams(newParams);

        setPagination(newState);
      }
    },
    onColumnFiltersChange: setPendingColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    manualFiltering: true
  });

  // Add this effect after the table initialization
  useEffect(() => {
    const page = searchParams?.get('page');
    const limit = searchParams?.get('limit');

    if (page !== null || limit !== null) {
      setPagination({
        pageIndex: page ? Number(page) - 1 : 0,
        pageSize: limit ? Number(limit) : 10
      });
    }
  }, [searchParams]);

  const getActiveFiltersCount = () => {
    return columnFilters.filter((filter) => filter.value).length;
  };

  const handleClearFilters = () => {
    setPendingColumnFilters([]);
    setColumnFilters([]);

    // Clear URL params for filters
    const newParams = new URLSearchParams(searchParams);
    filterFields.forEach((field) => {
      newParams.delete(field.value.toString());
    });

    // Keep pagination params
    newParams.set('page', '1');
    newParams.set('limit', pageSize.toString());

    setSearchParams(newParams);
    setIsFilterModalOpen(false);
  };

  useEffect(() => {
    if (onPaginationChange) {
      onPaginationChange(pageIndex + 1, pageSize);
    }
  }, [pageIndex, pageSize, onPaginationChange]);

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => setIsFilterModalOpen(true)}
          className="w-fit"
        >
          Filtros
          {getActiveFiltersCount() > 0 && (
            <Badge variant="secondary" className="ml-2">
              {getActiveFiltersCount()}
            </Badge>
          )}
        </Button>
      </div>

      <DataTableFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        table={table}
        columns={columns}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
        FilterControls={FilterControls}
      />

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1">
          <div className="rounded-md border">
            <ScrollArea className="h-[calc(100vh-500px)] rounded-md md:h-[calc(100vh-400px)]">
              <div className="w-full">
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
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
                          data-state={row.getIsSelected() && 'selected'}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
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
                          {ptPTTranslations.noResults}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </ScrollArea>
          </div>

          <div className="flex flex-col items-center justify-end gap-2 space-x-2 py-4 sm:flex-row">
            <div className="flex w-full items-center justify-between">
              <div className="flex-1 text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length}{' '}
                {ptPTTranslations.of} {table.getFilteredRowModel().rows.length}{' '}
                {ptPTTranslations.rowsSelected}
              </div>
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
                <div className="flex items-center space-x-2">
                  <p className="whitespace-nowrap text-sm font-medium">
                    {ptPTTranslations.rowsPerPage}
                  </p>
                  <Select
                    value={`${table.getState().pagination.pageSize}`}
                    onValueChange={(value: string) => {
                      const newSize = Number(value);
                      table.setPageSize(newSize);

                      // Update URL params with new page size
                      const newParams = new URLSearchParams(searchParams);
                      newParams.set('page', '1'); // Reset to first page when changing page size
                      newParams.set('limit', value);
                      setSearchParams(newParams);
                    }}
                  >
                    <SelectTrigger className="h-8 w-[70px]">
                      <SelectValue
                        placeholder={table.getState().pagination.pageSize}
                      />
                    </SelectTrigger>
                    <SelectContent side="top">
                      {pageSizeOptions.map((pageSize) => (
                        <SelectItem key={pageSize} value={`${pageSize}`}>
                          {pageSize}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="flex w-full items-center justify-between gap-2 sm:justify-end">
              <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                {ptPTTranslations.page}{' '}
                {table.getState().pagination.pageIndex + 1}{' '}
                {ptPTTranslations.of} {table.getPageCount()}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  aria-label={ptPTTranslations.goToFirstPage}
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  <DoubleArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button
                  aria-label={ptPTTranslations.goToPreviousPage}
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button
                  aria-label={ptPTTranslations.goToNextPage}
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button
                  aria-label={ptPTTranslations.goToLastPage}
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  <DoubleArrowRightIcon
                    className="h-4 w-4"
                    aria-hidden="true"
                  />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
