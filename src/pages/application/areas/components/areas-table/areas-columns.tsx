import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from '@/pages/application/areas/components/areas-table/areas-cell-action';
import { AreaDTO } from '@/types/dtos';

export const columns: ColumnDef<AreaDTO>[] = [
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
    id: 'actions',
    header: () => <div className="text-right"></div>,
    cell: ({ row }) => (
      <div className="flex items-center justify-end">
        <CellAction data={row.original} />
      </div>
    )
  }
];
