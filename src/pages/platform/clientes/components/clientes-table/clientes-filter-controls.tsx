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
    const currentFilters = table.getState().columnFilters;
    const newFilterValues: Record<string, string> = {};

    currentFilters.forEach((filter) => {
      if (filter.value) {
        newFilterValues[filter.id] = filter.value as string;
      }
    });

    setFilterValues(newFilterValues);
  }, [table.getState().columnFilters]);

  const handleFilterChange = (columnId: string, value: string) => {
    const newValue = value === 'all' ? '' : value;

    setFilterValues((prev) => ({
      ...prev,
      [columnId]: newValue
    }));

    table.getColumn(columnId)?.setFilterValue(newValue);
  };

  const renderFilterInput = (column: ColumnDef<ClienteDTO, unknown>) => {
    if (!('accessorKey' in column) || !column.accessorKey) return null;

    const commonInputStyles =
      'w-full justify-start px-4 py-6 text-left font-normal shadow-inner';

    if (column.accessorKey === 'ativo') {
      const currentValue = filterValues[column.accessorKey] ?? '';
      return (
        <Select
          value={currentValue === '' ? 'all' : currentValue}
          onValueChange={(value) =>
            handleFilterChange(column.accessorKey!.toString(), value)
          }
        >
          <SelectTrigger className={commonInputStyles}>
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
        className={commonInputStyles}
      />
    );
  };

  return (
    <>
      {columns
        .filter((column) => {
          return (
            'accessorKey' in column &&
            column.accessorKey &&
            filterFields.some((field) => field.value === column.accessorKey)
          );
        })
        .sort((a, b) => {
          const aField = filterFields.find(
            (field) => 'accessorKey' in a && field.value === a.accessorKey
          );
          const bField = filterFields.find(
            (field) => 'accessorKey' in b && field.value === b.accessorKey
          );
          return (aField?.order ?? Infinity) - (bField?.order ?? Infinity);
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
