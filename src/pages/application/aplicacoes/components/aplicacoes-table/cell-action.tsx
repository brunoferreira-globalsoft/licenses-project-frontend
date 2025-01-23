import { AlertModal } from '@/components/shared/alert-modal';
import { Button } from '@/components/ui/button';
import { Aplicacao } from '@/types/entities';
import { Edit, Trash } from 'lucide-react';
import { useState } from 'react';
import { EnhancedModal } from '@/components/ui/enhanced-modal';
import AplicacaoUpdateForm from '../aplicacao-forms/aplicacao-update-form';

interface CellActionProps {
  data: Aplicacao;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedAplicacao, setSelectedAplicacao] = useState<Aplicacao | null>(
    null
  );

  const onConfirm = async () => {};

  const handleUpdateClick = (aplicacao: Aplicacao) => {
    setSelectedAplicacao(aplicacao);
    setIsUpdateModalOpen(true);
  };

  return (
    <>
      <EnhancedModal
        title="Atualizar Aplicação"
        description="Atualize os dados da aplicação"
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        size="md"
      >
        {selectedAplicacao && (
          <AplicacaoUpdateForm
            modalClose={() => setIsUpdateModalOpen(false)}
            aplicacaoId={selectedAplicacao.id || ''}
            initialData={{
              nome: selectedAplicacao.nome,
              descricao: selectedAplicacao.descricao,
              ativo: selectedAplicacao.ativo,
              areaId: selectedAplicacao.areaId,
              versao: selectedAplicacao.versao || '1'
            }}
          />
        )}
      </EnhancedModal>

      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
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
