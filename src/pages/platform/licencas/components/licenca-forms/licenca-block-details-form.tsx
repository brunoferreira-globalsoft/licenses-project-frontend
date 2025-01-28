import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { useUnblockLicenca } from '../../queries/licencas-mutations';
import { toast } from '@/utils/toast-utils';
import { getErrorMessage, handleApiError } from '@/utils/error-handlers';

interface LicencaBlockDetailsFormProps {
  licencaId: string;
  dataBloqueio?: Date;
  motivoBloqueio?: string;
  modalClose: () => void;
}

const LicencaBlockDetailsForm = ({
  licencaId,
  dataBloqueio,
  motivoBloqueio,
  modalClose
}: LicencaBlockDetailsFormProps) => {
  const unblockLicencaMutation = useUnblockLicenca();

  const handleUnblockConfirm = async () => {
    try {
      const response = await unblockLicencaMutation.mutateAsync(licencaId);

      if (response.info.succeeded) {
        toast.success('Licença desbloqueada com sucesso!');
        modalClose();
      } else {
        toast.error(getErrorMessage(response, 'Erro ao desbloquear licença'));
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao desbloquear licença'));
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border p-4">
        <div className="mb-2">
          <span className="font-semibold">Data do Bloqueio:</span>{' '}
          {dataBloqueio
            ? format(new Date(dataBloqueio), 'dd/MM/yyyy HH:mm')
            : '-'}
        </div>
        <div>
          <span className="font-semibold">Motivo:</span> {motivoBloqueio || '-'}
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={modalClose}>
          Fechar
        </Button>
        <Button
          variant="emerald"
          onClick={handleUnblockConfirm}
          disabled={unblockLicencaMutation.isPending}
        >
          {unblockLicencaMutation.isPending
            ? 'Desbloqueando...'
            : 'Desbloquear'}
        </Button>
      </div>
    </div>
  );
};

export default LicencaBlockDetailsForm;
