import { DataTableFilterField } from '@/components/shared/data-table-types';
import { LicencaDTO } from '@/types/dtos';

export const filterFields: DataTableFilterField<LicencaDTO>[] = [
  {
    label: 'Nome',
    value: 'nome',
    order: 1
  },
  {
    label: 'Cliente',
    value: 'clienteId',
    order: 2
  },
  {
    label: 'Aplicação',
    value: 'aplicacaoId',
    order: 3
  },
  {
    label: 'Estado',
    value: 'ativo',
    order: 4
  },
  {
    label: 'Data Início',
    value: 'dataInicio',
    order: 5
  },
  {
    label: 'Data Fim',
    value: 'dataFim',
    order: 6
  }
];

// Add a constant to identify date fields
export const dateFields = ['dataInicio', 'dataFim'];
