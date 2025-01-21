import DataTable from '@/components/shared/data-table';
import { columns } from '@/pages/application/aplicacoes/components/aplicacoes-table/columns';
import AplicacoesTableActions from '@/pages/application/aplicacoes/components/aplicacoes-table/aplicacao-table-action';
import { Aplicacao } from '@/types/entities';

type TAplicacoesTableProps = {
  aplicacoes: Aplicacao[];
  page: number;
  totalAreas: number;
  pageCount: number;
};

export default function AplicacoesTable({
  aplicacoes,
  pageCount
}: TAplicacoesTableProps) {
  return (
    <>
      <AplicacoesTableActions />
      {aplicacoes && (
        <DataTable columns={columns} data={aplicacoes} pageCount={pageCount} />
      )}
    </>
  );
}
