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
import { useGetAplicacoesSelect } from '@/pages/application/aplicacoes/queries/aplicacoes-queries';
import { ModuloDTO } from '@/types/dtos';
import { getColumnHeader } from '@/utils/table-utils';
import { filterFields } from './modulos-constants';

export function ModulosFilterControls({
  table,
  columns,
  onApplyFilters,
  onClearFilters
}: BaseFilterControlsProps<ModuloDTO>) {
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const searchParams = new URLSearchParams(window.location.search);
  const aplicacaoIdParam = searchParams.get('aplicacaoId');

  const { data: aplicacoesData } = useGetAplicacoesSelect();

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

    // Then, if we have an aplicacaoIdParam and it's not already set, apply it
    if (aplicacaoIdParam && !newFilterValues['aplicacaoId']) {
      newFilterValues['aplicacaoId'] = aplicacaoIdParam;
      table.getColumn('aplicacaoId')?.setFilterValue(aplicacaoIdParam);
    }

    setFilterValues(newFilterValues);
  }, [table.getState().columnFilters, aplicacaoIdParam]);

  const handleFilterChange = (columnId: string, value: string) => {
    setFilterValues((prev) => ({
      ...prev,
      [columnId]: value
    }));
    table.getColumn(columnId)?.setFilterValue(value);
  };

  const renderFilterInput = (column: ColumnDef<ModuloDTO, unknown>) => {
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

    if (column.accessorKey === 'aplicacaoId') {
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
            <SelectValue placeholder="Selecione uma aplicação" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {aplicacoesData?.map((aplicacao) => (
              <SelectItem key={aplicacao.id} value={aplicacao.id || ''}>
                {aplicacao.nome}
              </SelectItem>
            ))}
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
