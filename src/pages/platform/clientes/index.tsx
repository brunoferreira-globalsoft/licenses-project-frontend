import { useState, useEffect } from 'react';
import PageHead from '@/components/shared/page-head';
import ClientesTable from '@/pages/platform/clientes/components/clientes-table';
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton';
import {
  useGetClientesPaginated,
  usePrefetchAdjacentClientes
} from '@/pages/platform/clientes/queries/clientes-queries';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';

export default function ClientesPage() {
  const searchParams = new URLSearchParams(window.location.search);
  const clienteIdParam = searchParams.get('clienteId');

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<Array<{ id: string; value: string }>>(
    clienteIdParam ? [{ id: 'clienteId', value: clienteIdParam }] : []
  );

  const { data, isLoading } = useGetClientesPaginated(
    page,
    pageSize,
    filters,
    null
  );
  const { prefetchPreviousPage, prefetchNextPage } =
    usePrefetchAdjacentClientes(page, pageSize, filters);

  const handleFiltersChange = (
    newFilters: Array<{ id: string; value: string }>
  ) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };

  const handlePaginationChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  useEffect(() => {
    prefetchPreviousPage();
    prefetchNextPage();
  }, [page, pageSize, filters]);

  const clientes = data?.info?.data || [];
  const totalClientes = data?.info?.totalCount || 0;
  const pageCount = data?.info?.totalPages || 0;

  if (isLoading) {
    return (
      <div className="p-5">
        <DataTableSkeleton
          columnCount={6}
          filterableColumnCount={2}
          searchableColumnCount={1}
        />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <PageHead title="Aplicações | GSLP" />
      <Breadcrumbs
        items={[
          { title: 'Administração', link: '/administracao' },
          { title: 'Clientes', link: '/clientes' }
        ]}
      />
      <ClientesTable
        clientes={clientes}
        page={page}
        totalClientes={totalClientes}
        pageCount={pageCount}
        onFiltersChange={handleFiltersChange}
        onPaginationChange={handlePaginationChange}
      />
    </div>
  );
}
