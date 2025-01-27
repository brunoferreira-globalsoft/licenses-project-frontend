import { BaseFilterControlsProps } from '@/components/shared/data-table-filter-controls-base';
import { LicencaDTO } from '@/types/dtos';
import { useGetClientesSelect } from '@/pages/platform/clientes/queries/clientes-queries';
import { useGetAplicacoesSelect } from '@/pages/application/aplicacoes/queries/aplicacoes-queries';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export function LicencasFilterControls({
  table,
  columns,
  onApplyFilters,
  onClearFilters
}: BaseFilterControlsProps<LicencaDTO>) {
  const { data: clientes } = useGetClientesSelect();
  const { data: aplicacoes } = useGetAplicacoesSelect();
  const [searchParams] = useSearchParams();
  const clienteIdParam = searchParams.get('clienteId');

  const [selectedCliente, setSelectedCliente] = useState<string | undefined>(
    clienteIdParam || undefined
  );
  const [selectedAplicacao, setSelectedAplicacao] = useState<string>();

  useEffect(() => {
    const filters: Array<{ id: string; value: string }> = [];
    if (selectedCliente) {
      filters.push({ id: 'clienteId', value: selectedCliente });
    }
    if (selectedAplicacao) {
      filters.push({ id: 'aplicacaoId', value: selectedAplicacao });
    }
    onApplyFilters();
  }, [selectedCliente, selectedAplicacao, onApplyFilters]);

  const handleFilterChange = (columnId: string, value: string) => {
    table.getColumn(columnId)?.setFilterValue(value);
    onApplyFilters();
  };

  return (
    <div className="flex flex-col gap-4 p-4 sm:flex-row">
      <div className="flex flex-col gap-2">
        <Label>Cliente</Label>
        <Select
          value={selectedCliente}
          onValueChange={(value) => setSelectedCliente(value)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Selecione um cliente" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos</SelectItem>
            {clientes?.map((cliente) => (
              <SelectItem key={cliente.id} value={cliente.id}>
                {cliente.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Aplicação</Label>
        <Select
          value={selectedAplicacao}
          onValueChange={(value) => setSelectedAplicacao(value)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Selecione uma aplicação" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas</SelectItem>
            {aplicacoes?.map((aplicacao) => (
              <SelectItem key={aplicacao.id} value={aplicacao.id}>
                {aplicacao.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
