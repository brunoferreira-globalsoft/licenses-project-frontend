import PageHead from '@/components/shared/page-head';
import { useGetAreas } from '@/pages/application/areas/queries/queries';
import AreasTable from '@/pages/application/areas/components/areas-table';
import { useSearchParams } from 'react-router-dom';
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import Areas from '@/lib/methods/application/areas';

export default function AreasPage() {
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const page = Number(searchParams.get('page') || 1);
  const pageLimit = Number(searchParams.get('limit') || 10);

  // Transform filters to match C# model
  const filters = Array.from(searchParams.entries())
    .filter(([key]) => ['nome'].includes(key))
    .map(([field, value]) => ({
      id: field,
      value
    }));

  const { data, isLoading } = useGetAreas(page, pageLimit, filters, null);

  // Prefetch adjacent pages
  useEffect(() => {
    if (page > 1) {
      queryClient.prefetchQuery({
        queryKey: ['areas', page - 1, pageLimit, filters, null],
        queryFn: () =>
          Areas('areas').getAreasPaginated({
            pageNumber: page - 1,
            pageSize: pageLimit,
            filters:
              (filters as unknown as Record<string, string>) ?? undefined,
            sorting: undefined
          })
      });
    }
    queryClient.prefetchQuery({
      queryKey: ['areas', page + 1, pageLimit, filters, null],
      queryFn: () =>
        Areas('areas').getAreasPaginated({
          pageNumber: page + 1,
          pageSize: pageLimit,
          filters: (filters as unknown as Record<string, string>) ?? undefined,
          sorting: undefined
        })
    });
  }, [page, pageLimit, filters, queryClient]);

  // Get the areas from the transformed response
  const areas = data?.info?.data || [];
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
      <PageHead title="Áreas | GSLP" />
      <Breadcrumbs
        items={[
          { title: 'Administração', link: '/administracao' },
          { title: 'Áreas', link: '/areas' }
        ]}
      />
      <AreasTable
        areas={areas}
        page={page}
        totalAreas={totalAreas}
        pageCount={pageCount}
        searchParams={Object.fromEntries(searchParams)}
      />
    </div>
  );
}
