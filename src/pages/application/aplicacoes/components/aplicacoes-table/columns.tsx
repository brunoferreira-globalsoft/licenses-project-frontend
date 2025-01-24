import { ColumnDef } from '@tanstack/react-table';
import { Aplicacao } from '@/types/entities';
import { CellAction } from './cell-action';
import { Checkbox } from '@/components/ui/checkbox';
import { Check, X } from 'lucide-react';

export const columns: ColumnDef<Aplicacao>[] = [
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
    header: 'Nome'
  },
  {
    accessorKey: 'descricao',
    header: 'Descrição'
  },
  {
    accessorKey: 'ativo',
    header: 'Estado',
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
    accessorKey: 'areaId',
    header: 'Área',
    cell: ({ row }) => {
      return <div>{row.original.area?.nome || '-'}</div>;
    }
  },
  {
    id: 'actions',
    header: () => <div className="text-center">Ações</div>,
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <CellAction data={row.original} />
      </div>
    )
  }
];
