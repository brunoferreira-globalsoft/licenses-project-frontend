import { AlertModal } from '@/components/shared/alert-modal';
import { Button } from '@/components/ui/button';
import { Edit, Lock, Unlock, Trash } from 'lucide-react';
import { useState } from 'react';
import { EnhancedModal } from '@/components/ui/enhanced-modal';
import { toast } from '@/utils/toast-utils';
import { LicencaDTO } from '@/types/dtos';
import { useNavigate } from 'react-router-dom';
import {
  useDeleteLicenca,
  useBlockLicenca,
  useUnblockLicenca
} from '../../queries/licencas-mutations';
import LicencaUpdateForm from '../licenca-forms/licenca-update-form';
import LicencaBlockForm from '../licenca-forms/licenca-block-form';
import LicencaBlockDetailsForm from '../licenca-forms/licenca-block-details-form';

interface CellActionProps {
  data: LicencaDTO;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isBlockDetailsModalOpen, setIsBlockDetailsModalOpen] = useState(false);
  const [selectedLicenca, setSelectedLicenca] = useState<LicencaDTO | null>(
    null
  );

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

      <EnhancedModal
        title="Bloquear Licença"
        description="Informe o motivo do bloqueio"
        isOpen={isBlockModalOpen}
        onClose={() => setIsBlockModalOpen(false)}
        size="md"
      >
        <LicencaBlockForm
          licencaId={data.id || ''}
          modalClose={() => setIsBlockModalOpen(false)}
        />
      </EnhancedModal>

      <EnhancedModal
        title="Detalhes do Bloqueio"
        description="Informações sobre o bloqueio da licença"
        isOpen={isBlockDetailsModalOpen}
        onClose={() => setIsBlockDetailsModalOpen(false)}
        size="md"
      >
        <LicencaBlockDetailsForm
          licencaId={data.id || ''}
          dataBloqueio={data.dataBloqueio}
          motivoBloqueio={data.motivoBloqueio}
          modalClose={() => setIsBlockDetailsModalOpen(false)}
        />
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
        {data.bloqueada ? (
          <Button
            onClick={() => setIsBlockDetailsModalOpen(true)}
            variant="ghost"
            className="h-8 w-8 p-0"
          >
            <Lock color="hsl(var(--destructive))" className="h-4 w-4" />
            <span className="sr-only">Ver Detalhes do Bloqueio</span>
          </Button>
        ) : (
          <Button
            onClick={() => setIsBlockModalOpen(true)}
            variant="ghost"
            className="h-8 w-8 p-0"
          >
            <Unlock color="hsl(var(--emerald))" className="h-4 w-4" />
            <span className="sr-only">Bloquear</span>
          </Button>
        )}
      </div>
    </>
  );
};
