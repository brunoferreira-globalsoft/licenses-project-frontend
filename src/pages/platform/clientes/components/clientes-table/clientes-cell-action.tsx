import { AlertModal } from '@/components/shared/alert-modal';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';
import { useState } from 'react';
import { EnhancedModal } from '@/components/ui/enhanced-modal';
import { toast } from '@/utils/toast-utils';
import ClienteUpdateForm from '@/pages/platform/clientes/components/cliente-forms/cliente-update-form';
import { useDeleteCliente } from '../../queries/clientes-mutations';
import { ClienteDTO } from '@/types/dtos';
import { useNavigate } from 'react-router-dom';

interface CellActionProps {
  data: ClienteDTO;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<ClienteDTO | null>(
    null
  );
  const navigate = useNavigate();

  const deleteClienteMutation = useDeleteCliente();

  const handleDeleteConfirm = async () => {
    try {
      await deleteClienteMutation.mutateAsync(data.id || '');
      toast.success('Cliente removido com sucesso');
    } catch (error) {
      toast.error('Erro ao remover o cliente');
    } finally {
      setOpen(false);
    }
  };

  const handleUpdateClick = (cliente: ClienteDTO) => {
    setSelectedCliente(cliente);
    setIsUpdateModalOpen(true);
  };

  return (
    <>
      <EnhancedModal
        title="Atualizar Cliente"
        description="Atualize os dados do cliente"
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        size="xl"
      >
        {selectedCliente && (
          <ClienteUpdateForm
            modalClose={() => setIsUpdateModalOpen(false)}
            clienteId={selectedCliente.id || ''}
            initialData={{
              nome: selectedCliente.nome,
              sigla: selectedCliente.sigla,
              dadosExternos: selectedCliente.dadosExternos || false,
              dadosUrl: selectedCliente.dadosUrl,
              ativo: selectedCliente.ativo || false,
              nif: selectedCliente.nif
            }}
          />
        )}
      </EnhancedModal>

      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleteClienteMutation.isPending}
      />

      <div className="flex items-center gap-2">
        <Button
          onClick={() => handleUpdateClick(data)}
          variant="ghost"
          className="h-8 w-8 p-0"
        >
          <Edit color="hsl(var(--primary))" className="h-4 w-4" />
          <span className="sr-only">Atualizar</span>
        </Button>
        <Button
          onClick={() => setOpen(true)}
          variant="ghost"
          className="h-8 w-8 p-0"
        >
          <Trash color="hsl(var(--destructive))" className="h-4 w-4" />
          <span className="sr-only">Apagar</span>
        </Button>
      </div>
    </>
  );
};
