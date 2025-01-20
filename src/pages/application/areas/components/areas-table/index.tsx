import DataTable from '@/components/shared/data-table';
import { columns } from '@/pages/application/areas/components/areas-table/columns';
import AreaTableActions from '@/pages/application/areas/components/areas-table/area-table-action';
import { Area } from '@/types/entities';

type TAreasTableProps = {
  areas: Area[];
  page: number;
  totalAreas: number;
  pageCount: number;
};

export default function AreasTable({ areas, pageCount }: TAreasTableProps) {
  return (
    <>
      <AreaTableActions />
      {areas && (
        <DataTable columns={columns} data={areas} pageCount={pageCount} />
      )}
    </>
  );
}
