import { BaseFilterControlsProps } from '@/components/shared/data-table-filter-controls-base';
import { LicencaDTO } from '@/types/dtos';
import { useGetClientesSelect } from '@/pages/platform/clientes/queries/clientes-queries';
import { useGetAplicacoesSelect } from '@/pages/application/aplicacoes/queries/aplicacoes-queries';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { getColumnHeader } from '@/utils/table-utils';
import { filterFields, dateFields } from './licencas-constants';
import { DatePicker } from '@/components/ui/date-picker';
import { ColumnDef } from '@tanstack/react-table';

export function LicencasFilterControls({
  table,
  columns,
  onApplyFilters,
  onClearFilters
}: BaseFilterControlsProps<LicencaDTO>) {
  const { data: clientes } = useGetClientesSelect();
  const { data: aplicacoes } = useGetAplicacoesSelect();
  const [searchParams] = useSearchParams();
  const clienteIdParam = searchParams.get('clienteId');

  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  useEffect(() => {
    const currentFilters = table.getState().columnFilters;
    const newFilterValues: Record<string, string> = {};

    currentFilters.forEach((filter) => {
      if (filter.value) {
        newFilterValues[filter.id] = filter.value as string;
      }
    });

    if (clienteIdParam) {
      newFilterValues['clienteId'] = clienteIdParam;
      table.getColumn('clienteId')?.setFilterValue(clienteIdParam);
    }

    setFilterValues(newFilterValues);
  }, [table.getState().columnFilters, clienteIdParam]);

  const handleFilterChange = (columnId: string, value: string) => {
    const newValue = value === 'all' ? '' : value;

    setFilterValues((prev) => ({
      ...prev,
      [columnId]: newValue
    }));

    table.getColumn(columnId)?.setFilterValue(newValue);
  };

  const renderFilterInput = (column: ColumnDef<LicencaDTO, unknown>) => {
    if (!('accessorKey' in column) || !column.accessorKey) return null;

    const commonInputStyles =
      'w-full justify-start px-4 py-6 text-left font-normal shadow-inner';

    if (
      column.accessorKey === 'dataInicio' ||
      column.accessorKey === 'dataFim'
    ) {
      const currentValue = filterValues[column.accessorKey] ?? '';
      return (
        <DatePicker
          value={currentValue ? new Date(currentValue) : undefined}
          onChange={(date) =>
            handleFilterChange(
              column.accessorKey!.toString(),
              date ? date.toISOString() : ''
            )
          }
          className={commonInputStyles}
          placeholder={`Selecione a ${column.accessorKey === 'dataInicio' ? 'data de início' : 'data de fim'}`}
        />
      );
    }

    if (column.accessorKey === 'clienteId') {
      return (
        <Select
          value={filterValues['clienteId'] || 'all'}
          onValueChange={(value) => handleFilterChange('clienteId', value)}
        >
          <SelectTrigger className={commonInputStyles}>
            <SelectValue placeholder="Selecione um cliente" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {clientes?.map((cliente) => (
              <SelectItem key={cliente.id} value={cliente.id}>
                {cliente.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (column.accessorKey === 'aplicacaoId') {
      return (
        <Select
          value={filterValues['aplicacaoId'] || 'all'}
          onValueChange={(value) => handleFilterChange('aplicacaoId', value)}
        >
          <SelectTrigger className={commonInputStyles}>
            <SelectValue placeholder="Selecione uma aplicação" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {aplicacoes?.map((aplicacao) => (
              <SelectItem key={aplicacao.id} value={aplicacao.id}>
                {aplicacao.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (column.accessorKey === 'ativo') {
      return (
        <Select
          value={filterValues[column.accessorKey] || 'all'}
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
