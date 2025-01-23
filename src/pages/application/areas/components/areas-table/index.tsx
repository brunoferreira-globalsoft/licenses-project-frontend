import DataTable from '@/components/shared/data-table';
import { columns } from './columns';
import AreaTableActions from './area-table-action';
import { Area } from '@/types/entities';
import { filterFields } from './constants';
import { AreasFilterControls } from './areas-filter-controls';

type TAreasTableProps = {
  areas: Area[];
  page: number;
  totalAreas: number;
  pageCount: number;
  onFiltersChange?: (filters: Array<{ id: string; value: string }>) => void;
  onPaginationChange?: (page: number, pageSize: number) => void;
};

export default function AreasTable({
  areas,
  pageCount,
  onFiltersChange,
  onPaginationChange
}: TAreasTableProps) {
  const handleFiltersChange = (
    filters: Array<{ id: string; value: string }>
  ) => {
    if (onFiltersChange) {
      onFiltersChange(filters);
    }
  };

  const handlePaginationChange = (page: number, pageSize: number) => {
    if (onPaginationChange) {
      onPaginationChange(page, pageSize);
    }
  };

  return (
    <>
      <AreaTableActions />
      {areas && (
        <DataTable
          columns={columns}
          data={areas}
          pageCount={pageCount}
          filterFields={filterFields}
          FilterControls={AreasFilterControls}
          onFiltersChange={handleFiltersChange}
          onPaginationChange={handlePaginationChange}
        />
      )}
    </>
  );
}
