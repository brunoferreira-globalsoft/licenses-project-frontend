import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { EnhancedModal } from '@/components/ui/enhanced-modal';
import { Plus } from 'lucide-react';
import LicencaCreateForm from '../licenca-forms/licenca-create-form';

export default function LicencasTableActions() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="flex items-center justify-between py-5">
      <div className="flex flex-1 gap-4">
        {/* <TableSearchInput placeholder="Procurar Licenças..." /> */}
      </div>
      <div className="flex gap-3">
        <Button variant="emerald" onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Adicionar
        </Button>

        <EnhancedModal
          title="Criar Nova Licença"
          description="Crie uma nova licença"
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          size="xl"
        >
          <LicencaCreateForm modalClose={() => setIsCreateModalOpen(false)} />
        </EnhancedModal>
      </div>
    </div>
  );
}
