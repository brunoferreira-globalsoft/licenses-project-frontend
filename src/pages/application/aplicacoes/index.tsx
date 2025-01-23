import { useState } from 'react';
import PageHead from '@/components/shared/page-head';
import AplicacoesTable from './components/aplicacoes-table';
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton';
import { useGetAplicacoes } from './queries/queries';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import AplicacoesService from '@/lib/services/application/aplicacoes';

export default function AplicacoesPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<Array<{ id: string; value: string }>>(
    []
  );
  const queryClient = useQueryClient();

  const { data, isLoading } = useGetAplicacoes(page, pageSize, filters, null);

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

  // Prefetch adjacent pages
  useEffect(() => {
    if (page > 1) {
      queryClient.prefetchQuery({
        queryKey: ['aplicacoes', page - 1, pageSize, filters, null],
        queryFn: () =>
          AplicacoesService('aplicacoes').getAplicacoesPaginated({
            pageNumber: page - 1,
            pageSize: pageSize,
            filters:
              (filters as unknown as Record<string, string>) ?? undefined,
            sorting: undefined
          })
      });
    }
    queryClient.prefetchQuery({
      queryKey: ['aplicacoes', page + 1, pageSize, filters, null],
      queryFn: () =>
        AplicacoesService('aplicacoes').getAplicacoesPaginated({
          pageNumber: page + 1,
          pageSize: pageSize,
          filters: (filters as unknown as Record<string, string>) ?? undefined,
          sorting: undefined
        })
    });
  }, [page, pageSize, filters, queryClient]);

  const aplicacoes = data?.info?.data || [];
  const totalAreas = data?.info?.totalCount || 0;
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
        totalAreas={totalAreas}
        pageCount={pageCount}
        onFiltersChange={handleFiltersChange}
        onPaginationChange={handlePaginationChange}
      />
    </div>
  );
}
