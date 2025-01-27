import { DataTableFilterField } from '@/components/shared/data-table-types';
import { LicencaDTO } from '@/types/dtos';

export const filterFields: DataTableFilterField<LicencaDTO>[] = [
  {
    label: 'Nome',
    value: 'nome'
  },
  {
    label: 'Cliente',
    value: 'clienteId'
  },
  {
    label: 'Aplicação',
    value: 'aplicacaoId'
  },
  {
    label: 'Estado',
    value: 'ativo'
  }
];
