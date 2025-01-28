import { useState } from 'react';
import PageHead from '@/components/shared/page-head';
import {
  useGetAreasPaginated,
  usePrefetchAdjacentAreas
} from '@/pages/application/areas/queries/areas-queries';
import AreasTable from '@/pages/application/areas/components/areas-table';
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import { useEffect } from 'react';

export default function AreasPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<Array<{ id: string; value: string }>>(
    []
  );

  const { data, isLoading } = useGetAreasPaginated(
    page,
    pageSize,
    filters,
    null
  );
  const { prefetchPreviousPage, prefetchNextPage } = usePrefetchAdjacentAreas(
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
        onFiltersChange={handleFiltersChange}
        onPaginationChange={handlePaginationChange}
      />
    </div>
  );
}
