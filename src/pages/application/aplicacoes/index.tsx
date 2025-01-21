import PageHead from '@/components/shared/page-head';
import { useSearchParams } from 'react-router-dom';
import AplicacoesTable from '@/pages/application/aplicacoes/components/aplicacoes-table';
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton';
import { useGetAplicacoes } from './queries/queries';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';

export default function AplicacoesPage() {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get('page') || 1);
  const pageLimit = Number(searchParams.get('limit') || 10);
  const search = searchParams.get('search') || null;
  const { data, isLoading } = useGetAplicacoes(page, pageLimit, search, null);

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
