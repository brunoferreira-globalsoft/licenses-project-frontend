import { DataTableFilterField } from '@/components/shared/data-table-types';
import { FuncionalidadeDTO } from '@/types/dtos';

export const filterFields: DataTableFilterField<FuncionalidadeDTO>[] = [
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
