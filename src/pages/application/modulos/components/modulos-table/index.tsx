import DataTable from '@/components/shared/data-table';
import ModulosTableActions from '@/pages/application/modulos/components/modulos-table/modulos-table-actions';
import { filterFields } from '@/pages/application/modulos/components/modulos-table/modulos-constants';
import { ModulosFilterControls } from '@/pages/application/modulos/components/modulos-table/modulos-filter-controls';
import { ModuloDTO } from '@/types/dtos';
import { columns } from '@/pages/application/modulos/components/modulos-table/modulos-columns';
type TAplicacoesTableProps = {
  modulos: ModuloDTO[];
  page: number;
  totalModulos: number;
  pageCount: number;
  onFiltersChange?: (filters: Array<{ id: string; value: string }>) => void;
  onPaginationChange?: (page: number, pageSize: number) => void;
};

export default function ModulosTable({
  modulos,
  pageCount,
  onFiltersChange,
  onPaginationChange
}: TAplicacoesTableProps) {
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

  const searchParams = new URLSearchParams(window.location.search);
  const aplicacaoIdParam = searchParams.get('aplicacaoId');
  const initialActiveFiltersCount = aplicacaoIdParam ? 1 : 0;

  return (
    <>
      <ModulosTableActions />
      {modulos && (
        <DataTable
          columns={columns}
          data={modulos}
          pageCount={pageCount}
          filterFields={filterFields}
          FilterControls={ModulosFilterControls}
          onFiltersChange={handleFiltersChange}
          onPaginationChange={handlePaginationChange}
          initialActiveFiltersCount={initialActiveFiltersCount}
          baseRoute="/modulos"
        />
      )}
    </>
  );
}
