import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

type TPopupModalProps = {
  title?: string;
  description?: string;
  trigger?: React.ReactNode;
  children: ((onClose: () => void) => React.ReactNode) | React.ReactNode;
  className?: string;
  footer?: (onClose: () => void) => React.ReactNode;
};

export default function PopupModal({
  title,
  description,
  trigger,
  children,
  className,
  footer
}: TPopupModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);

  return (
    <>
      {trigger ? (
        <div onClick={() => setIsOpen(true)}>{trigger}</div>
      ) : (
        <Button className="text-xs md:text-sm" onClick={() => setIsOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Adicionar
        </Button>
      )}

      <Modal
        title={title}
        description={description}
        isOpen={isOpen}
        onClose={onClose}
        className={className}
      >
        <div className="flex h-full flex-col">
          <ScrollArea className="flex-1 px-6">
            {typeof children === 'function' ? children(onClose) : children}
          </ScrollArea>
          {footer && (
            <div className="mt-6 flex items-center justify-end space-x-2 border-t px-6 pt-4">
              {footer(onClose)}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
