import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { EnhancedModal } from '@/components/ui/enhanced-modal';
import { Plus } from 'lucide-react';
import AplicacaoCreateForm from '@/pages/application/aplicacoes/components/aplicacao-forms/aplicacao-create-form';

export default function AplicacaoTableActions() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="flex items-center justify-between py-5">
      <div className="flex flex-1 gap-4">
        {/* <TableSearchInput placeholder="Procurar Aplicações..." /> */}
      </div>
      <div className="flex gap-3">
        <Button variant="emerald" onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Adicionar
        </Button>

        <EnhancedModal
          title="Criar Nova Aplicação"
          description="Crie uma nova aplicação"
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          size="md"
        >
          <AplicacaoCreateForm modalClose={() => setIsCreateModalOpen(false)} />
        </EnhancedModal>
      </div>
    </div>
  );
}
