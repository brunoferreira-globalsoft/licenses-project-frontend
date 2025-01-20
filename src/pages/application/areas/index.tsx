import PageHead from '@/components/shared/page-head';
import { useGetAreas } from '@/pages/application/areas/queries/queries';
import AreasTable from '@/pages/application/areas/components/areas-table';
import { useSearchParams } from 'react-router-dom';
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';

export default function AreasPage() {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get('page') || 1);
  const pageLimit = Number(searchParams.get('limit') || 10);
  const search = searchParams.get('search') || null;
  const offset = (page - 1) * pageLimit;
  const { data, isLoading } = useGetAreas(offset, pageLimit, search);

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
      <PageHead title="Áreas | App" />
      {/* <Breadcrumbs
          items={[
            { title: 'Dashboard', link: '/' },
            { title: 'Areas', link: '/areas' }
          ]}
        /> */}
      <AreasTable
        areas={areas}
        page={page}
        totalAreas={totalAreas}
        pageCount={pageCount}
      />
    </div>
  );
}
