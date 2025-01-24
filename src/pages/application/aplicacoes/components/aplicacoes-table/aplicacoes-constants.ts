import { DataTableFilterField } from '@/components/shared/data-table-types';
import { AplicacaoDTO } from '@/types/dtos';

export const filterFields: DataTableFilterField<AplicacaoDTO>[] = [
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
