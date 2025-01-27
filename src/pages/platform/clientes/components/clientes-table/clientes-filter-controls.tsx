import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { BaseFilterControlsProps } from '@/components/shared/data-table-filter-controls-base';
import { ColumnDef } from '@tanstack/react-table';
import { filterFields } from './clientes-constants';
import { getColumnHeader } from '@/utils/table-utils';
import { ClienteDTO } from '@/types/dtos';

export function ClientesFilterControls({
  table,
  columns,
  onApplyFilters,
  onClearFilters
}: BaseFilterControlsProps<ClienteDTO>) {
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  useEffect(() => {
    // Get current filters from the table's state
    const currentFilters = table.getState().columnFilters;
    const newFilterValues: Record<string, string> = {};

    // First, apply any existing table filters
    currentFilters.forEach((filter) => {
      if (filter.value) {
        newFilterValues[filter.id] = filter.value as string;
      }
    });

    setFilterValues(newFilterValues);
  }, [table.getState().columnFilters]);

  const handleFilterChange = (columnId: string, value: string) => {
    const newValue = value === 'all' ? '' : value;

    // Update local state
    setFilterValues((prev) => ({
      ...prev,
      [columnId]: newValue
    }));

    // Update table filter
    table.getColumn(columnId)?.setFilterValue(newValue);
  };

  const renderFilterInput = (column: ColumnDef<ClienteDTO, unknown>) => {
    if (!('accessorKey' in column) || !column.accessorKey) return null;

    if (column.accessorKey === 'ativo') {
      const currentValue = filterValues[column.accessorKey] ?? '';
      return (
        <Select
          value={currentValue === '' ? 'all' : currentValue}
          onValueChange={(value) =>
            handleFilterChange(column.accessorKey!.toString(), value)
          }
        >
          <SelectTrigger className="max-w-sm">
            <SelectValue placeholder="Selecione o estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="true">Ativo</SelectItem>
            <SelectItem value="false">Inativo</SelectItem>
          </SelectContent>
        </Select>
      );
    }

    return (
      <Input
        placeholder={`Filtrar por ${getColumnHeader(column, filterFields).toLowerCase()}...`}
        value={filterValues[column.accessorKey.toString()] ?? ''}
        onChange={(event) =>
          handleFilterChange(column.accessorKey.toString(), event.target.value)
        }
        className="max-w-sm"
      />
    );
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
              {renderFilterInput(column)}
            </div>
          );
        })}
    </>
  );
}
