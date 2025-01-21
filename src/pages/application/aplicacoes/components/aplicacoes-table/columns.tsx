import { Checkbox } from '@/components/ui/checkbox';
import { Aplicacao } from '@/types/entities';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from '@/pages/application/areas/components/areas-table/cell-action';
import { CheckIcon, CrossCircledIcon as XIcon } from '@radix-ui/react-icons';

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
    enableSorting: true,
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
    header: () => <div className="text-center">Ativo</div>,
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        {row.original.ativo ? (
          <CheckIcon className="h-4 w-4 text-primary" />
        ) : (
          <XIcon className="h-4 w-4 text-destructive" />
        )}
      </div>
    )
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
