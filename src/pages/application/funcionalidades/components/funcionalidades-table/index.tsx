import DataTable from '@/components/shared/data-table';
import { columns } from './funcionalidades-columns';
import FuncionalidadesTableActions from './funcionalidades-table-action';
import { FuncionalidadeDTO } from '@/types/dtos';
import { FuncionalidadesFilterControls } from '@/pages/application/funcionalidades/components/funcionalidades-table/funcionalidades-filter-controls';
import { filterFields } from '@/pages/application/funcionalidades/components/funcionalidades-table/funcionalidades-constants';

type TFuncionalidadesTableProps = {
  funcionalidades: FuncionalidadeDTO[];
  page: number;
  totalFuncionalidades: number;
  pageCount: number;
  onFiltersChange?: (filters: Array<{ id: string; value: string }>) => void;
  onPaginationChange?: (page: number, pageSize: number) => void;
};

export default function FuncionalidadesTable({
  funcionalidades,
  pageCount,
  onFiltersChange,
  onPaginationChange
}: TFuncionalidadesTableProps) {
  const searchParams = new URLSearchParams(window.location.search);
  const moduloIdParam = searchParams.get('moduloId');
  const initialActiveFiltersCount = moduloIdParam ? 1 : 0;

  const handleFiltersChange = (
    filters: Array<{ id: string; value: string }>
  ) => {
    if (onFiltersChange) {
      onFiltersChange(filters);
    }
  };

  const handlePaginationChange = (page: number, pageSize: number) => {
    if (onPaginationChange) {
      onPaginationChange(page, pageSize);
    }
  };

  return (
    <>
      <FuncionalidadesTableActions />
      {funcionalidades && (
        <DataTable
          columns={columns}
          data={funcionalidades}
          pageCount={pageCount}
          filterFields={filterFields}
          FilterControls={FuncionalidadesFilterControls}
          onFiltersChange={handleFiltersChange}
          onPaginationChange={handlePaginationChange}
          initialActiveFiltersCount={initialActiveFiltersCount}
          baseRoute="/funcionalidades"
        />
      )}
    </>
  );
}
