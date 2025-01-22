import PopupModal from '@/components/shared/popup-modal';
import TableSearchInput from '@/components/shared/table-search-input';
import AreaCreateForm from '@/pages/application/areas/components/area-forms/area-create-form';
import { Button } from '@/components/ui/button';

export default function AreaTableActions() {
  return (
    <div className="flex items-center justify-between py-5">
      <div className="flex flex-1 gap-4">
        {/* <TableSearchInput placeholder="Procurar Áreas..." /> */}
      </div>
      <div className="flex gap-3">
        <PopupModal
          footer={(onClose) => (
            <>
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" form="areaCreateForm">
                Criar
              </Button>
            </>
          )}
        >
          {(onClose) => <AreaCreateForm modalClose={onClose} />}
        </PopupModal>
      </div>
    </div>
  );
}
