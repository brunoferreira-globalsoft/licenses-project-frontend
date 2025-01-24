import DataTable from '@/components/shared/data-table';
import { columns } from '@/pages/application/aplicacoes/components/aplicacoes-table/aplicacoes-columns';
import AplicacoesTableActions from '@/pages/application/aplicacoes/components/aplicacoes-table/aplicacoes-table-action';
import { Aplicacao } from '@/types/entities';
import { filterFields } from '@/pages/application/aplicacoes/components/aplicacoes-table/aplicacoes-constants';
import { AplicacoesFilterControls } from '@/pages/application/aplicacoes/components/aplicacoes-table/aplicacoes-filter-controls';

type TAplicacoesTableProps = {
  aplicacoes: Aplicacao[];
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
        />
      )}
    </>
  );
}
