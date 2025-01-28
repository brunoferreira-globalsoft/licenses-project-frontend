import { DataTableFilterField } from '@/components/shared/data-table-types';
import { ModuloDTO } from '@/types/dtos';

export const filterFields: DataTableFilterField<ModuloDTO>[] = [
  {
    label: 'Nome',
    value: 'nome',
    order: 1
  },
  {
    label: 'Descrição',
    value: 'descricao',
    order: 2
  },
  {
    label: 'Ativo',
    value: 'ativo',
    order: 3
  },
  {
    label: 'Aplicação',
    value: 'aplicacaoId',
    order: 4
  }
];
