import { useState, useEffect } from 'react';
import FuncionalidadesTable from '@/pages/application/funcionalidades/components/funcionalidades-table';
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton';
import {
  useGetFuncionalidadesPaginated,
  usePrefetchAdjacentFuncionalidades
} from '@/pages/application/funcionalidades/queries/funcionalidades-queries';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';

export default function FuncionalidadesPage() {
  const searchParams = new URLSearchParams(window.location.search);
  const moduloIdParam = searchParams.get('moduloId');

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<Array<{ id: string; value: string }>>(
    moduloIdParam ? [{ id: 'moduloId', value: moduloIdParam }] : []
  );

  const { data, isLoading } = useGetFuncionalidadesPaginated(
    page,
    pageSize,
    filters,
    null
  );
  const { prefetchPreviousPage, prefetchNextPage } =
    usePrefetchAdjacentFuncionalidades(page, pageSize, filters);

  const handleFiltersChange = (
    newFilters: Array<{ id: string; value: string }>
  ) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handlePaginationChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  useEffect(() => {
    prefetchPreviousPage();
    prefetchNextPage();
  }, [page, pageSize, filters]);

  const funcionalidades = data?.info?.data || [];
  const totalFuncionalidades = data?.info?.totalCount || 0;
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
    <div className="flex flex-col gap-5 p-5">
      <Breadcrumbs
        items={[
          { title: 'Início', link: '/' },
          { title: 'Funcionalidades', link: '/funcionalidades' }
        ]}
      />
      <FuncionalidadesTable
        funcionalidades={funcionalidades}
        page={page}
        totalFuncionalidades={totalFuncionalidades}
        pageCount={pageCount}
        onFiltersChange={handleFiltersChange}
        onPaginationChange={handlePaginationChange}
      />
    </div>
  );
}
