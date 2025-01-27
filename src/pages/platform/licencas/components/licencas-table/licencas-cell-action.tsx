import { AlertModal } from '@/components/shared/alert-modal';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';
import { useState } from 'react';
import { EnhancedModal } from '@/components/ui/enhanced-modal';
import { toast } from '@/utils/toast-utils';
import { LicencaDTO } from '@/types/dtos';
import { useNavigate } from 'react-router-dom';
import { useDeleteLicenca } from '../../queries/licencas-mutations';
import LicencaUpdateForm from '../licenca-forms/licenca-update-form';

interface CellActionProps {
  data: LicencaDTO;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedLicenca, setSelectedLicenca] = useState<LicencaDTO | null>(
    null
  );
  const navigate = useNavigate();

  const deleteLicencaMutation = useDeleteLicenca();

  const handleDeleteConfirm = async () => {
    try {
      await deleteLicencaMutation.mutateAsync(data.id || '');
      toast.success('Licença removida com sucesso');
    } catch (error) {
      toast.error('Erro ao remover a licença');
    } finally {
      setOpen(false);
    }
  };

  const handleUpdateClick = (licenca: LicencaDTO) => {
    setSelectedLicenca(licenca);
    setIsUpdateModalOpen(true);
  };

  return (
    <>
      <EnhancedModal
        title="Atualizar Licença"
        description="Atualize os dados da licença"
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        size="xl"
      >
        {selectedLicenca && (
          <LicencaUpdateForm
            modalClose={() => setIsUpdateModalOpen(false)}
            licencaId={selectedLicenca.id || ''}
            initialData={{
              nome: selectedLicenca.nome,
              dataInicio: selectedLicenca.dataInicio,
              dataFim: selectedLicenca.dataFim,
              numeroUtilizadores: selectedLicenca.numeroUtilizadores,
              ativo: selectedLicenca.ativo || false,
              aplicacaoId: selectedLicenca.aplicacaoId,
              clienteId: selectedLicenca.clienteId
            }}
          />
        )}
      </EnhancedModal>

      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleteLicencaMutation.isPending}
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
