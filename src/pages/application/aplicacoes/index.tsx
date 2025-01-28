import { useState, useEffect } from 'react';
import PageHead from '@/components/shared/page-head';
import AplicacoesTable from '@/pages/application/aplicacoes/components/aplicacoes-table';
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton';
import {
  useGetAplicacoesPaginated,
  usePrefetchAdjacentAplicacoes
} from '@/pages/application/aplicacoes/queries/aplicacoes-queries';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';

export default function AplicacoesPage() {
  const searchParams = new URLSearchParams(window.location.search);
  const areaIdParam = searchParams.get('areaId');

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<Array<{ id: string; value: string }>>(
    areaIdParam ? [{ id: 'areaId', value: areaIdParam }] : []
  );

  const { data, isLoading } = useGetAplicacoesPaginated(
    page,
    pageSize,
    filters,
    null
  );
  const { prefetchPreviousPage, prefetchNextPage } =
    usePrefetchAdjacentAplicacoes(page, pageSize, filters);

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

  const aplicacoes = data?.info?.data || [];
  const totalAplicacoes = data?.info?.totalCount || 0;
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
          { title: 'Aplicações', link: '/aplicacoes' }
        ]}
      />
      <AplicacoesTable
        aplicacoes={aplicacoes}
        page={page}
        totalAreas={totalAplicacoes}
        pageCount={pageCount}
        onFiltersChange={handleFiltersChange}
        onPaginationChange={handlePaginationChange}
      />
    </div>
  );
}
