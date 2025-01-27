import { DataTableFilterField } from '@/components/shared/data-table-types';
import { ModuloDTO } from '@/types/dtos';

export const filterFields: DataTableFilterField<ModuloDTO>[] = [
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
  },
  {
    label: 'Aplicação',
    value: 'aplicacaoId'
  }
];
