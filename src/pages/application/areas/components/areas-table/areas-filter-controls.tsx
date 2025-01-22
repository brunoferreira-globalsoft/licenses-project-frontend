import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BaseFilterControlsProps } from '@/components/shared/data-table-filter-controls-base';
import { Area } from '@/types/entities';

export function AreasFilterControls({
  table,
  columns,
  onApplyFilters,
  onClearFilters
}: BaseFilterControlsProps<Area>) {
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  const handleFilterChange = (columnId: string, value: string) => {
    setFilterValues((prev) => ({
      ...prev,
      [columnId]: value
    }));
    table.getColumn(columnId)?.setFilterValue(value);
  };

  const getColumnHeader = (column: any): string => {
    if (typeof column.header === 'string') return column.header;
    if (typeof column.header === 'function') return column.accessorKey;
    return column.accessorKey;
  };

  return (
    <>
      {columns
        .filter((column) => {
          const excludedColumns = ['select', 'actions', 'page', 'limit'];
          return (
            column.accessorKey &&
            !excludedColumns.includes(column.accessorKey.toString())
          );
        })
        .map((column) => (
          <div key={`${column.id}-${column.accessorKey}`} className="space-y-2">
            <Label>{getColumnHeader(column)}</Label>
            <Input
              placeholder={`Filtrar por ${getColumnHeader(column).toLowerCase()}...`}
              value={filterValues[column.accessorKey] ?? ''}
              onChange={(event) =>
                handleFilterChange(column.accessorKey, event.target.value)
              }
              className="max-w-sm"
            />
          </div>
        ))}
    </>
  );
}
