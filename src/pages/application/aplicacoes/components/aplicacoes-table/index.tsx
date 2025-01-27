import DataTable from '@/components/shared/data-table';
import { columns } from '@/pages/application/aplicacoes/components/aplicacoes-table/aplicacoes-columns';
import AplicacoesTableActions from '@/pages/application/aplicacoes/components/aplicacoes-table/aplicacoes-table-action';
import { filterFields } from '@/pages/application/aplicacoes/components/aplicacoes-table/aplicacoes-constants';
import { AplicacoesFilterControls } from '@/pages/application/aplicacoes/components/aplicacoes-table/aplicacoes-filter-controls';
import { AplicacaoDTO } from '@/types/dtos';
type TAplicacoesTableProps = {
  aplicacoes: AplicacaoDTO[];
  page: number;
  totalAreas: number;
  pageCount: number;
  onFiltersChange?: (filters: Array<{ id: string; value: string }>) => void;
  onPaginationChange?: (page: number, pageSize: number) => void;
};

export default function AplicacoesTable({
  aplicacoes,
  pageCount,
  onFiltersChange,
  onPaginationChange
}: TAplicacoesTableProps) {
  const searchParams = new URLSearchParams(window.location.search);
  const areaIdParam = searchParams.get('areaId');
  const initialActiveFiltersCount = areaIdParam ? 1 : 0;

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
      <AplicacoesTableActions />
      {aplicacoes && (
        <DataTable
          columns={columns}
          data={aplicacoes}
          pageCount={pageCount}
          filterFields={filterFields}
          FilterControls={AplicacoesFilterControls}
          onFiltersChange={handleFiltersChange}
          onPaginationChange={handlePaginationChange}
          initialActiveFiltersCount={initialActiveFiltersCount}
          baseRoute="/aplicacoes"
        />
      )}
    </>
  );
}
