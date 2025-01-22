import { useState } from 'react';
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
import { Aplicacao } from '@/types/entities';

export function AplicacoesFilterControls({
  table,
  columns,
  onApplyFilters,
  onClearFilters
}: BaseFilterControlsProps<Aplicacao>) {
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

  const renderFilterInput = (column: any) => {
    if (column.accessorKey === 'ativo') {
      const currentValue = filterValues[column.accessorKey] ?? '';
      return (
        <Select
          value={currentValue === '' ? 'all' : currentValue}
          onValueChange={(value) =>
            handleFilterChange(column.accessorKey, value === 'all' ? '' : value)
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
        placeholder={`Filtrar por ${getColumnHeader(column).toLowerCase()}...`}
        value={filterValues[column.accessorKey] ?? ''}
        onChange={(event) =>
          handleFilterChange(column.accessorKey, event.target.value)
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
            column.accessorKey &&
            !excludedColumns.includes(column.accessorKey.toString())
          );
        })
        .map((column) => (
          <div key={`${column.id}-${column.accessorKey}`} className="space-y-2">
            <Label>{getColumnHeader(column)}</Label>
            {renderFilterInput(column)}
          </div>
        ))}
    </>
  );
}
