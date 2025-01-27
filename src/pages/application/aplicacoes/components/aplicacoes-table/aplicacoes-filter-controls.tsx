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
import { useGetAreasSelect } from '@/pages/application/areas/queries/areas-queries';
import { AplicacaoDTO } from '@/types/dtos';

export function AplicacoesFilterControls({
  table,
  columns,
  onApplyFilters,
  onClearFilters
}: BaseFilterControlsProps<AplicacaoDTO>) {
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const searchParams = new URLSearchParams(window.location.search);
  const areaIdParam = searchParams.get('areaId');

  const { data: areasData } = useGetAreasSelect();

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

    // Then, if we have an areaIdParam and it's not already set, apply it
    if (areaIdParam && !newFilterValues['areaId']) {
      newFilterValues['areaId'] = areaIdParam;
      table.getColumn('areaId')?.setFilterValue(areaIdParam);
    }

    setFilterValues(newFilterValues);
  }, [table.getState().columnFilters, areaIdParam]);

  const handleFilterChange = (columnId: string, value: string) => {
    setFilterValues((prev) => ({
      ...prev,
      [columnId]: value
    }));
    table.getColumn(columnId)?.setFilterValue(value);
  };

  const getColumnHeader = (
    column: ColumnDef<AplicacaoDTO, unknown>
  ): string => {
    if (typeof column.header === 'string') return column.header;
    if ('accessorKey' in column) return column.accessorKey.toString();
    return '';
  };

  const renderFilterInput = (column: ColumnDef<AplicacaoDTO, unknown>) => {
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

    if (column.accessorKey === 'areaId') {
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
            <SelectValue placeholder="Selecione uma área" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {areasData?.map((area) => (
              <SelectItem key={area.id} value={area.id || ''}>
                {area.nome}
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
