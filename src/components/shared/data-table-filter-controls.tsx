import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { CheckIcon, TrashIcon } from '@radix-ui/react-icons';

interface DataTableFilterControlsProps<TData> {
  table: any;
  columns: any[];
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

export function DataTableFilterControls<TData>({
  table,
  columns,
  onApplyFilters,
  onClearFilters
}: DataTableFilterControlsProps<TData>) {
  const [searchParams] = useSearchParams();
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const filterableColumns = useMemo(() => {
    return columns.filter((column) => {
      // Exclude pagination and non-filterable columns
      const excludedColumns = ['select', 'actions', 'page', 'limit'];
      return (
        column.accessorKey &&
        !excludedColumns.includes(column.accessorKey.toString())
      );
    });
  }, [columns]);

  useEffect(() => {
    // Initialize filter values
    const initialFilterValues: Record<string, string> = {};
    filterableColumns.forEach((column) => {
      const columnFilterValue = table
        .getColumn(column.accessorKey!)
        ?.getFilterValue();
      if (columnFilterValue) {
        initialFilterValues[column.accessorKey!] = columnFilterValue.toString();
      }
    });
    setFilterValues(initialFilterValues);
  }, [table, filterableColumns]);

  const getColumnHeader = (column: any): string => {
    if (typeof column.header === 'string') return column.header;
    if (typeof column.header === 'function') return column.accessorKey;
    return column.accessorKey;
  };

  const handleFilterChange = (columnId: string, value: string) => {
    // Update the filterValues state while preserving other filters
    setFilterValues((prev) => ({
      ...prev,
      [columnId]: value
    }));

    // Update the table filter
    table.getColumn(columnId)?.setFilterValue(value);
  };

  const handleClearFilters = () => {
    setFilterValues({});
    filterableColumns.forEach((column) => {
      table.getColumn(column.accessorKey)?.setFilterValue('');
    });
    onClearFilters();
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
      {filterableColumns.map((column) => (
        <div key={`${column.id}-${column.accessorKey}`} className="space-y-2">
          <Label>{getColumnHeader(column)}</Label>
          {renderFilterInput(column)}
        </div>
      ))}
    </>
  );
}
