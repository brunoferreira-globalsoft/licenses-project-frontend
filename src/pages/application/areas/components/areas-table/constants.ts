import { DataTableFilterField } from '@/components/shared/data-table-types';
import { Area } from '@/types/entities';

export const filterFields: DataTableFilterField<Area>[] = [
  {
    label: 'Nome',
    value: 'nome'
  }
];
