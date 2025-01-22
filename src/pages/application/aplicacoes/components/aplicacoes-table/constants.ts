import { DataTableFilterField } from '@/components/data-table/types';
import { Aplicacao } from '@/types/entities';

export const filterFields: DataTableFilterField<Aplicacao>[] = [
  {
    label: 'Nome',
    value: 'nome'
  },
  {
    label: 'Descrição',
    value: 'descricao'
  },
  {
    label: 'Ativo',
    value: 'ativo'
  }
];
