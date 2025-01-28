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
import { getColumnHeader } from '@/utils/table-utils';
import { filterFields } from './funcionalidades-constants';

export function FuncionalidadesFilterControls({
  table,
  columns,
  onApplyFilters,
  onClearFilters
}: BaseFilterControlsProps<FuncionalidadeDTO>) {
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [initialParamApplied, setInitialParamApplied] = useState(false);
  const searchParams = new URLSearchParams(window.location.search);
  const moduloIdParam = searchParams.get('moduloId');

  const { data: modulosData } = useGetModulosSelect();

  useEffect(() => {
    const currentFilters = table.getState().columnFilters;
    const newFilterValues: Record<string, string> = {};

    currentFilters.forEach((filter) => {
      if (filter.value) {
        newFilterValues[filter.id] = filter.value as string;
      }
    });

    if (moduloIdParam && !initialParamApplied) {
      newFilterValues['moduloId'] = moduloIdParam;
      table.getColumn('moduloId')?.setFilterValue(moduloIdParam);
      setInitialParamApplied(true);
    }

    setFilterValues(newFilterValues);
  }, [table.getState().columnFilters, moduloIdParam, initialParamApplied]);

  const handleFilterChange = (columnId: string, value: string) => {
    const newValue = value === 'all' ? '' : value;

    setFilterValues((prev) => ({
      ...prev,
      [columnId]: newValue
    }));

    table.getColumn(columnId)?.setFilterValue(newValue);

    if (initialParamApplied) {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('moduloId');
      window.history.pushState({}, '', newUrl);
    }
  };

  const renderFilterInput = (column: ColumnDef<FuncionalidadeDTO, unknown>) => {
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
          <SelectTrigger className={commonInputStyles}>
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
