import AreaCreateForm from '@/pages/application/areas/components/area-forms/area-create-form';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { EnhancedModal } from '@/components/ui/enhanced-modal';
import { Plus } from 'lucide-react';

export default function AreaTableActions() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="flex items-center justify-between py-5">
      <div className="flex flex-1 gap-4">
        {/* <TableSearchInput placeholder="Procurar Áreas..." /> */}
      </div>
      <div className="flex gap-3">
        <Button variant="emerald" onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Adicionar
        </Button>

        <EnhancedModal
          title="Criar Nova Área"
          description="Crie uma nova área para atribuir nas aplicações"
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          size="md"
        >
          <AreaCreateForm modalClose={() => setIsCreateModalOpen(false)} />
        </EnhancedModal>
      </div>
    </div>
  );
}
