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
import { DataTableFilterField } from '@/components/shared/data-table-types';
import { DataTableFilterModal } from '@/components/shared/data-table-filter-modal';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useNavigate } from 'react-router-dom';

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount: number;
  filterFields?: DataTableFilterField<TData>[];
  pageSizeOptions?: number[];
  initialFilters?: ColumnFiltersState;
  initialActiveFiltersCount?: number;
  onPaginationChange?: (page: number, pageSize: number) => void;
  onFiltersChange?: (filters: Array<{ id: string; value: string }>) => void;
  FilterControls: React.ComponentType<{
    table: any;
    columns: any[];
    onApplyFilters: () => void;
    onClearFilters: () => void;
  }>;
  baseRoute?: string;
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

export default function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  filterFields = [],
  pageSizeOptions = [10, 20, 30, 40, 50],
  initialFilters = [],
  initialActiveFiltersCount,
  onPaginationChange,
  onFiltersChange,
  FilterControls,
  baseRoute
}: DataTableProps<TData, TValue>) {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [columnFilters, setColumnFilters] =
    useState<ColumnFiltersState>(initialFilters);
  const [pendingColumnFilters, setPendingColumnFilters] =
    useState<ColumnFiltersState>(initialFilters);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const navigate = useNavigate();

  const handlePaginationChange = (
    newPageIndex: number,
    newPageSize: number
  ) => {
    setPageIndex(newPageIndex);
    setPageSize(newPageSize);
    if (onPaginationChange) {
      onPaginationChange(newPageIndex + 1, newPageSize);
    }
  };

  const handleApplyFilters = () => {
    setColumnFilters(pendingColumnFilters);
    if (onFiltersChange) {
      const formattedFilters = pendingColumnFilters
        .filter((filter) => filter.value)
        .map((filter) => ({
          id: filter.id,
          value: filter.value as string
        }));
      onFiltersChange(formattedFilters);
    }
    setIsFilterModalOpen(false);
  };

  const handleClearFilters = () => {
    setPendingColumnFilters([]);
    setColumnFilters([]);
    if (onFiltersChange) {
      onFiltersChange([]);
    }
    if (baseRoute) {
      navigate(baseRoute);
    }
    setIsFilterModalOpen(false);
  };

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
        handlePaginationChange(newState.pageIndex, newState.pageSize);
      }
    },
    onColumnFiltersChange: setPendingColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    manualFiltering: true
  });

  const getActiveFiltersCount = () => {
    const columnFiltersCount = columnFilters.filter(
      (filter) => filter.value
    ).length;
    return Math.max(columnFiltersCount, initialActiveFiltersCount || 0);
  };

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
          <ScrollArea className="h-[calc(100vh-500px)] rounded-md border md:h-[calc(100vh-400px)]">
            <Table className="relative">
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
                      );
                    })}
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
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

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
