import { toast as baseToast } from '@/components/ui/use-toast';

type ToastVariant = 'default' | 'destructive';

interface ToastOptions {
  title?: string;
  description: string;
  variant?: ToastVariant;
}

export const toast = {
  success: (description: string, title: string = 'Sucesso') => {
    baseToast({
      title,
      description,
      variant: 'default'
    });
  },

  error: (description: string | string[], title: string = 'Erro') => {
    const errorMessage = Array.isArray(description)
      ? description.join(', ')
      : description;

    baseToast({
      title,
      description: errorMessage,
      variant: 'destructive'
    });
  },

  custom: ({ title, description, variant = 'default' }: ToastOptions) => {
    baseToast({
      title,
      description,
      variant
    });
  }
};
