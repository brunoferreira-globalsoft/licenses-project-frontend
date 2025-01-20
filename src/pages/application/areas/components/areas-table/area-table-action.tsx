import PopupModal from '@/components/shared/popup-modal';
import TableSearchInput from '@/components/shared/table-search-input';
import { Button } from '@/components/ui/button';
import { DownloadIcon } from 'lucide-react';
import AreaCreateForm from '@/pages/application/areas/components/area-forms/area-create-form';

export default function AreaTableActions() {
  return (
    <div className="flex items-center justify-between py-5">
      <div className="flex flex-1 gap-4">
        <TableSearchInput placeholder="Procurar Áreas..." />
      </div>
      <div className="flex gap-3">
        <Button>
          <DownloadIcon className="h-6 w-6" />
          Download CSV
        </Button>
        <PopupModal
          renderModal={(onClose) => <AreaCreateForm modalClose={onClose} />}
        />
      </div>
    </div>
  );
}
