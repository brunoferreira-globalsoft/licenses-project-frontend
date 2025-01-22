import PageHead from '@/components/shared/page-head';
import { useSearchParams } from 'react-router-dom';
import AplicacoesTable from '@/pages/application/aplicacoes/components/aplicacoes-table';
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton';
import { useGetAplicacoes } from './queries/queries';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import Aplicacoes from '@/lib/methods/application/aplicacoes';

export default function AplicacoesPage() {
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const page = Number(searchParams.get('page') || 1);
  const pageLimit = Number(searchParams.get('limit') || 10);

  // Transform filters to match C# model
  const filters = Array.from(searchParams.entries())
    .filter(([key]) => ['nome', 'descricao', 'ativo'].includes(key))
    .map(([field, value]) => ({
      id: field,
      value
    }));

  const { data, isLoading } = useGetAplicacoes(page, pageLimit, filters, null);

  // Prefetch adjacent pages
  useEffect(() => {
    if (page > 1) {
      queryClient.prefetchQuery({
        queryKey: ['aplicacoes', page - 1, pageLimit, filters, null],
        queryFn: () =>
          Aplicacoes('aplicacoes').getAplicacoesPaginated({
            pageNumber: page - 1,
            pageSize: pageLimit,
            filters:
              (filters as unknown as Record<string, string>) ?? undefined,
            sorting: undefined
          })
      });
    }
    queryClient.prefetchQuery({
      queryKey: ['aplicacoes', page + 1, pageLimit, filters, null],
      queryFn: () =>
        Aplicacoes('aplicacoes').getAplicacoesPaginated({
          pageNumber: page + 1,
          pageSize: pageLimit,
          filters: (filters as unknown as Record<string, string>) ?? undefined,
          sorting: undefined
        })
    });
  }, [page, pageLimit, filters, queryClient]);

  // Get the aplicacoes from the transformed response
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
      />
    </div>
  );
}
