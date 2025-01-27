import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BaseFilterControlsProps } from '@/components/shared/data-table-filter-controls-base';
import { ColumnDef } from '@tanstack/react-table';
import { AreaDTO } from '@/types/dtos';
import { getColumnHeader } from '@/utils/table-utils';
import { filterFields } from './areas-constants';

export function AreasFilterControls({
  table,
  columns,
  onApplyFilters,
  onClearFilters
}: BaseFilterControlsProps<AreaDTO>) {
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  useEffect(() => {
    const initialFilterValues: Record<string, string> = {};
    columns
      .filter((column) => {
        const excludedColumns = ['select', 'actions', 'page', 'limit'];
        return (
          'accessorKey' in column &&
          column.accessorKey &&
          !excludedColumns.includes(column.accessorKey.toString())
        );
      })
      .forEach((column) => {
        if ('accessorKey' in column && column.accessorKey) {
          const columnFilterValue = table
            .getColumn(column.accessorKey)
            ?.getFilterValue();
          if (columnFilterValue) {
            initialFilterValues[column.accessorKey.toString()] =
              columnFilterValue.toString();
          }
        }
      });
    setFilterValues(initialFilterValues);
  }, [table, columns]);

  const handleFilterChange = (columnId: string, value: string) => {
    setFilterValues((prev) => ({
      ...prev,
      [columnId]: value
    }));
    table.getColumn(columnId)?.setFilterValue(value);
  };

  return (
    <>
      {columns
        .filter((column) => {
          const excludedColumns = ['select', 'actions', 'page', 'limit'];
          return (
            'accessorKey' in column &&
            column.accessorKey &&
            !excludedColumns.includes(column.accessorKey.toString())
          );
        })
        .map((column) => {
          if (!('accessorKey' in column) || !column.accessorKey) return null;
          return (
            <div
              key={`${column.id}-${column.accessorKey}`}
              className="space-y-2"
            >
              <Label>{getColumnHeader(column, filterFields)}</Label>
              <Input
                placeholder={`Filtrar por ${getColumnHeader(column, filterFields).toLowerCase()}...`}
                value={filterValues[column.accessorKey.toString()] ?? ''}
                onChange={(event) =>
                  handleFilterChange(
                    column.accessorKey.toString(),
                    event.target.value
                  )
                }
                className="max-w-sm"
              />
            </div>
          );
        })}
    </>
  );
}
