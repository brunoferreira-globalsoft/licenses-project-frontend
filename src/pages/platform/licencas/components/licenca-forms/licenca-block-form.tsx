import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/utils/toast-utils';
import { useBlockLicenca } from '../../queries/licencas-mutations';
import { useState } from 'react';
import { getErrorMessage, handleApiError } from '@/utils/error-handlers';

interface LicencaBlockFormProps {
  licencaId: string;
  modalClose: () => void;
}

const LicencaBlockForm = ({ licencaId, modalClose }: LicencaBlockFormProps) => {
  const [motivoBloqueio, setMotivoBloqueio] = useState('');
  const blockLicencaMutation = useBlockLicenca();

  const handleBlockConfirm = async () => {
    if (!motivoBloqueio.trim()) {
      toast.error('O motivo do bloqueio é obrigatório');
      return;
    }

    try {
      const response = await blockLicencaMutation.mutateAsync({
        licencaId,
        motivoBloqueio: motivoBloqueio.trim()
      });

      if (response.info.succeeded) {
        toast.success('Licença bloqueada com sucesso!');
        modalClose();
      } else {
        toast.error(getErrorMessage(response, 'Erro ao bloquear licença'));
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao bloquear licença'));
    }
  };

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Digite o motivo do bloqueio"
        value={motivoBloqueio}
        onChange={(e) => setMotivoBloqueio(e.target.value)}
        className="min-h-[100px]"
      />
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={modalClose}>
          Cancelar
        </Button>
        <Button
          variant="destructive"
          onClick={handleBlockConfirm}
          disabled={blockLicencaMutation.isPending}
        >
          {blockLicencaMutation.isPending ? 'Bloqueando...' : 'Bloquear'}
        </Button>
      </div>
    </div>
  );
};

export default LicencaBlockForm;
