import DataTable from '@/components/shared/data-table';
import { columns } from '@/pages/application/aplicacoes/components/aplicacoes-table/columns';
import AplicacoesTableActions from '@/pages/application/aplicacoes/components/aplicacoes-table/aplicacao-table-action';
import { Aplicacao } from '@/types/entities';
import { filterFields } from './constants';
import { searchParamsCache } from '@/pages/application/aplicacoes/components/aplicacoes-table/search-params';
import React from 'react';

type TAplicacoesTableProps = {
  aplicacoes: Aplicacao[];
  page: number;
  totalAreas: number;
  pageCount: number;
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default function AplicacoesTable({
  aplicacoes,
  pageCount,
  searchParams = {}
}: TAplicacoesTableProps) {
  const search = searchParamsCache.parse(searchParams);

  return (
    <>
      <AplicacoesTableActions />
      {aplicacoes && (
        <DataTable
          columns={columns}
          data={aplicacoes}
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
