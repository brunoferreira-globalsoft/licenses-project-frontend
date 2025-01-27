import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Check, X } from 'lucide-react';
import { ClienteDTO } from '@/types/dtos';
import { CellAction } from '@/pages/platform/clientes/components/clientes-table/clientes-cell-action';

export const columns: ColumnDef<ClienteDTO>[] = [
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
    accessorKey: 'sigla',
    header: 'Sigla'
  },
  {
    accessorKey: 'nif',
    header: 'NIF'
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
