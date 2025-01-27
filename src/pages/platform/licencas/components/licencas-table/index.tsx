import DataTable from '@/components/shared/data-table';
import { columns } from './licencas-columns';
import LicencasTableActions from './licencas-table-actions';
import { filterFields } from './licencas-constants';
import { LicencaDTO } from '@/types/dtos';
import { LicencasFilterControls } from '@/pages/platform/licencas/components/licencas-table/licencas-filter-controls';

type TLicencasTableProps = {
  licencas: LicencaDTO[];
  page: number;
  totalLicencas: number;
  pageCount: number;
  onFiltersChange?: (filters: Array<{ id: string; value: string }>) => void;
  onPaginationChange?: (page: number, pageSize: number) => void;
};

export function LicencasTable({
  licencas,
  pageCount,
  onFiltersChange,
  onPaginationChange
}: TLicencasTableProps) {
  const searchParams = new URLSearchParams(window.location.search);
  const clienteIdParam = searchParams.get('clienteId');
  const initialActiveFiltersCount = clienteIdParam ? 1 : 0;

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
      <LicencasTableActions />
      {licencas && (
        <DataTable
          columns={columns}
          data={licencas}
          pageCount={pageCount}
          filterFields={filterFields}
          FilterControls={LicencasFilterControls}
          onFiltersChange={handleFiltersChange}
          onPaginationChange={handlePaginationChange}
          initialActiveFiltersCount={initialActiveFiltersCount}
          baseRoute="/licencas"
        />
      )}
    </>
  );
}
