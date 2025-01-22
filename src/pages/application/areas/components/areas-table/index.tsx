import DataTable from '@/components/shared/data-table';
import { columns } from './columns';
import AreaTableActions from './area-table-action';
import { Area } from '@/types/entities';
import { filterFields } from './constants';
import { searchParamsCache } from './search-params';

type TAreasTableProps = {
  areas: Area[];
  page: number;
  totalAreas: number;
  pageCount: number;
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default function AreasTable({
  areas,
  pageCount,
  searchParams = {}
}: TAreasTableProps) {
  const search = searchParamsCache.parse(searchParams);

  return (
    <>
      <AreaTableActions />
      {areas && (
        <DataTable
          columns={columns}
          data={areas}
          pageCount={pageCount}
          filterFields={filterFields}
          defaultColumnFilters={Object.entries(search)
            .map(([key, value]) => ({
              id: key,
              value: value?.toString() ?? null
            }))
            .filter(({ value }) => value ?? undefined)}
        />
      )}
    </>
  );
}
