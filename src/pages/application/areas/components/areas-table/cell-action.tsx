import { AlertModal } from '@/components/shared/alert-modal';
import { Button } from '@/components/ui/button';
import { Area } from '@/types/entities';
import { Edit, Trash } from 'lucide-react';
import { useState } from 'react';
import AreaUpdateForm from '@/pages/application/areas/components/area-forms/area-update-form';
import { EnhancedModal } from '@/components/ui/enhanced-modal';
import { useQueryClient } from '@tanstack/react-query';
import AreasService from '@/lib/services/application/areas-service';
import { toast } from '@/utils/toast-utils';
import { getErrorMessage, handleApiError } from '@/utils/error-handlers';

interface CellActionProps {
  data: Area;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);
  const queryClient = useQueryClient();

  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      const response = await AreasService('areas').deleteArea(data.id || '');

      if (response.info.succeeded) {
        toast.success('Área removida com sucesso');
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: ['areas']
          }),
          queryClient.invalidateQueries({
            queryKey: ['areas-select']
          })
        ]);
      } else {
        toast.error(getErrorMessage(response, 'Erro ao remover área'));
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao remover área'));
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const handleUpdateClick = (area: Area) => {
    setSelectedArea(area);
    setIsUpdateModalOpen(true);
  };

  return (
    <>
      <EnhancedModal
        title="Atualizar Área"
        description="Atualize os dados da área"
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        size="md"
      >
        {selectedArea && (
          <AreaUpdateForm
            modalClose={() => setIsUpdateModalOpen(false)}
            areaId={selectedArea.id || ''}
            initialData={{ nome: selectedArea.nome }}
          />
        )}
      </EnhancedModal>

      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={loading}
        title="Remover Área"
        description="Tem certeza que deseja remover esta área?"
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
