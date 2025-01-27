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
import { useGetModulosSelect } from '@/pages/application/modulos/queries/modulos-queries';
import { FuncionalidadeDTO } from '@/types/dtos';

export function FuncionalidadesFilterControls({
  table,
  columns,
  onApplyFilters,
  onClearFilters
}: BaseFilterControlsProps<FuncionalidadeDTO>) {
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const searchParams = new URLSearchParams(window.location.search);
  const moduloIdParam = searchParams.get('moduloId');

  const { data: modulosData } = useGetModulosSelect();

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

    // Then, if we have a moduloIdParam and it's not already set, apply it
    if (moduloIdParam && !newFilterValues['moduloId']) {
      newFilterValues['moduloId'] = moduloIdParam;
      table.getColumn('moduloId')?.setFilterValue(moduloIdParam);
    }

    setFilterValues(newFilterValues);
  }, [table.getState().columnFilters, moduloIdParam]);

  const handleFilterChange = (columnId: string, value: string) => {
    const newValue = value === 'all' ? '' : value;
    setFilterValues((prev) => ({
      ...prev,
      [columnId]: newValue
    }));
    table.getColumn(columnId)?.setFilterValue(newValue);
  };

  const getColumnHeader = (
    column: ColumnDef<FuncionalidadeDTO, unknown>
  ): string => {
    if (typeof column.header === 'string') return column.header;
    if ('accessorKey' in column) return column.accessorKey.toString();
    return '';
  };

  const renderFilterInput = (column: ColumnDef<FuncionalidadeDTO, unknown>) => {
    if (!('accessorKey' in column) || !column.accessorKey) return null;

    if (column.accessorKey === 'ativo') {
      const currentValue = filterValues[column.accessorKey] ?? '';
      return (
        <Select
          value={currentValue === '' ? 'all' : currentValue}
          onValueChange={(value) =>
            handleFilterChange(
              column.accessorKey!.toString(),
              value === 'all' ? '' : value
            )
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

    if (column.accessorKey === 'moduloId') {
      const currentValue = filterValues[column.accessorKey] ?? '';
      return (
        <Select
          value={currentValue === '' ? 'all' : currentValue}
          onValueChange={(value) =>
            handleFilterChange(
              column.accessorKey!.toString(),
              value === 'all' ? '' : value
            )
          }
        >
          <SelectTrigger className="max-w-sm">
            <SelectValue placeholder="Selecione um módulo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {modulosData?.map((modulo) => (
              <SelectItem key={modulo.id} value={modulo.id || ''}>
                {modulo.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    return (
      <Input
        placeholder={`Filtrar por ${getColumnHeader(column).toLowerCase()}...`}
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
              <Label>{getColumnHeader(column)}</Label>
              {renderFilterInput(column)}
            </div>
          );
        })}
    </>
  );
}
