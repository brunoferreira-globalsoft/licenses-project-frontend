import DataTable from '@/components/shared/data-table';
import { columns } from '@/pages/platform/clientes/components/clientes-table/clientes-columns';
import ClientesTableActions from '@/pages/platform/clientes/components/clientes-table/clientes-table-action';
import { filterFields } from '@/pages/platform/clientes/components/clientes-table/clientes-constants';
import { ClientesFilterControls } from '@/pages/platform/clientes/components/clientes-table/clientes-filter-controls';
import { ClienteDTO } from '@/types/dtos';
type TAplicacoesTableProps = {
  clientes: ClienteDTO[];
  page: number;
  totalClientes: number;
  pageCount: number;
  onFiltersChange?: (filters: Array<{ id: string; value: string }>) => void;
  onPaginationChange?: (page: number, pageSize: number) => void;
};

export default function ClientesTable({
  clientes,
  pageCount,
  onFiltersChange,
  onPaginationChange
}: TAplicacoesTableProps) {
  const searchParams = new URLSearchParams(window.location.search);
  const clienteIdParam = searchParams.get('clienteId');
  const initialActiveFiltersCount = clienteIdParam ? 1 : 0;

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
      <ClientesTableActions />
      {clientes && (
        <DataTable
          columns={columns}
          data={clientes}
          pageCount={pageCount}
          filterFields={filterFields}
          FilterControls={ClientesFilterControls}
          onFiltersChange={handleFiltersChange}
          onPaginationChange={handlePaginationChange}
          initialActiveFiltersCount={initialActiveFiltersCount}
          baseRoute="/clientes"
        />
      )}
    </>
  );
}
