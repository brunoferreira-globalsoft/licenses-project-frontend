import { ColumnDef } from '@tanstack/react-table';
import { LicencaDTO } from '@/types/dtos';
import { Check, X } from 'lucide-react';
import { format } from 'date-fns';
import { CellAction } from './licencas-cell-action';
import { Checkbox } from '@/components/ui/checkbox';

export const columns: ColumnDef<LicencaDTO>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Selecionar todos"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Selecionar linha"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'nome',
    header: 'Nome',
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate" title={row.original.nome}>
        {row.original.nome}
      </div>
    )
  },
  {
    accessorKey: 'clienteId',
    header: 'Cliente',
    cell: ({ row }) => (
      <div
        className="max-w-[200px] truncate"
        title={row.original.cliente?.nome}
      >
        {row.original.cliente?.nome}
      </div>
    )
  },
  {
    accessorKey: 'aplicacaoId',
    header: 'Aplicação',
    cell: ({ row }) => (
      <div
        className="max-w-[200px] truncate"
        title={row.original.aplicacao?.nome}
      >
        {row.original.aplicacao?.nome}
      </div>
    )
  },
  {
    accessorKey: 'numeroUtilizadores',
    header: 'Nº Utilizadores'
  },
  {
    accessorKey: 'dataInicio',
    header: 'Data Início',
    cell: ({ row }) => {
      const date = row.original.dataInicio;
      return date ? format(new Date(date), 'dd/MM/yyyy') : '-';
    }
  },
  {
    accessorKey: 'dataFim',
    header: 'Data Fim',
    cell: ({ row }) => {
      const date = row.original.dataFim;
      return date ? format(new Date(date), 'dd/MM/yyyy') : '-';
    }
  },
  {
    accessorKey: 'ativo',
    header: () => <div className="text-center">Estado</div>,
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        {row.original.ativo ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <X className="h-4 w-4 text-destructive" />
        )}
      </div>
    )
  },
  {
    id: 'actions',
    header: () => <div className="text-right"></div>,
    cell: ({ row }) => (
      <div className="flex items-center justify-end">
        <CellAction data={row.original} />
      </div>
    )
  }
];
