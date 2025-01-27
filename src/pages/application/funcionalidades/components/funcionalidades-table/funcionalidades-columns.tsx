import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from '@/pages/application/modulos/components/modulos-table/modulos-cell-action';
import { Checkbox } from '@/components/ui/checkbox';
import { Check, X } from 'lucide-react';
import { FuncionalidadeDTO } from '@/types/dtos';

export const columns: ColumnDef<FuncionalidadeDTO>[] = [
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
    accessorKey: 'moduloId',
    header: 'Módulo',
    cell: ({ row }) => {
      return <div>{row.original.modulo?.nome || '-'}</div>;
    }
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
