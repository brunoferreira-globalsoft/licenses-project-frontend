import { Checkbox } from '@/components/ui/checkbox';
import { Area } from '@/types/entities';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from '@/pages/application/areas/components/areas-table/cell-action';

export const columns: ColumnDef<Area>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
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
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
