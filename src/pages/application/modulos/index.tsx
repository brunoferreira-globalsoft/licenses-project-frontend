import { useState, useEffect } from 'react';
import PageHead from '@/components/shared/page-head';
import ModulosTable from '@/pages/application/modulos/components/modulos-table';
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton';
import {
  useGetModulosPaginated,
  usePrefetchAdjacentModulos
} from '@/pages/application/modulos/queries/modulos-queries';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';

export default function ModulosPage() {
  const searchParams = new URLSearchParams(window.location.search);
  const aplicacaoIdParam = searchParams.get('aplicacaoId');

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<Array<{ id: string; value: string }>>(
    aplicacaoIdParam ? [{ id: 'aplicacaoId', value: aplicacaoIdParam }] : []
  );

  const { data, isLoading } = useGetModulosPaginated(
    page,
    pageSize,
    filters,
    null
  );
  const { prefetchPreviousPage, prefetchNextPage } = usePrefetchAdjacentModulos(
    page,
    pageSize,
    filters
  );

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

  const modulos = data?.info?.data || [];
  const totalModulos = data?.info?.totalCount || 0;
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
      <PageHead title="Modulos | GSLP" />
      <Breadcrumbs
        items={[
          { title: 'Administração', link: '/administracao' },
          { title: 'Modulos', link: '/modulos' }
        ]}
      />
      <ModulosTable
        modulos={modulos}
        page={page}
        totalModulos={totalModulos}
        pageCount={pageCount}
        onFiltersChange={handleFiltersChange}
        onPaginationChange={handlePaginationChange}
      />
    </div>
  );
}
