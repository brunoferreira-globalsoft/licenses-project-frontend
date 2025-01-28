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
  const [initialParamApplied, setInitialParamApplied] = useState(false);
  const searchParams = new URLSearchParams(window.location.search);
  const aplicacaoIdParam = searchParams.get('aplicacaoId');

  const { data: aplicacoesData } = useGetAplicacoesSelect();

  useEffect(() => {
    const currentFilters = table.getState().columnFilters;
    const newFilterValues: Record<string, string> = {};

    currentFilters.forEach((filter) => {
      if (filter.value) {
        newFilterValues[filter.id] = filter.value as string;
      }
    });

    if (aplicacaoIdParam && !initialParamApplied) {
      newFilterValues['aplicacaoId'] = aplicacaoIdParam;
      table.getColumn('aplicacaoId')?.setFilterValue(aplicacaoIdParam);
      setInitialParamApplied(true);
    }

    setFilterValues(newFilterValues);
  }, [table.getState().columnFilters, aplicacaoIdParam, initialParamApplied]);

  const handleFilterChange = (columnId: string, value: string) => {
    const newValue = value === 'all' ? '' : value;

    setFilterValues((prev) => ({
      ...prev,
      [columnId]: newValue
    }));

    table.getColumn(columnId)?.setFilterValue(newValue);

    if (initialParamApplied) {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('aplicacaoId');
      window.history.pushState({}, '', newUrl);
    }
  };

  const renderFilterInput = (column: ColumnDef<ModuloDTO, unknown>) => {
    if (!('accessorKey' in column) || !column.accessorKey) return null;

    const commonInputStyles =
      'w-full justify-start px-4 py-6 text-left font-normal shadow-inner';

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
          <SelectTrigger className={commonInputStyles}>
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
