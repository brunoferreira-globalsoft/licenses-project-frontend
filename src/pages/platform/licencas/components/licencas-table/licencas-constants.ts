import { DataTableFilterField } from '@/components/shared/data-table-types';
import { LicencaDTO } from '@/types/dtos';

export const filterFields: DataTableFilterField<LicencaDTO>[] = [
  {
    label: 'Nome',
    value: 'nome'
  },
  {
    label: 'Cliente',
    value: 'nomeCliente'
  },
  {
    label: 'Aplicação',
    value: 'nomeAplicacao'
  }
];
