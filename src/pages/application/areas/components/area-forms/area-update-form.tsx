import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from '@/utils/toast-utils';
import AreasService from '@/lib/services/application/areas';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getErrorMessage, handleApiError } from '@/utils/error-handlers';

const areaFormSchema = z.object({
  nome: z
    .string({ required_error: 'O Nome é obrigatório' })
    .min(1, { message: 'O Nome deve ter pelo menos 1 caractere' })
});

type AreaFormSchemaType = z.infer<typeof areaFormSchema>;

interface AreaUpdateFormProps {
  modalClose: () => void;
  areaId: string;
  initialData: {
    nome: string;
  };
}

const AreaUpdateForm = ({
  modalClose,
  areaId,
  initialData
}: AreaUpdateFormProps) => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<AreaFormSchemaType>({
    resolver: zodResolver(areaFormSchema),
    defaultValues: {
      nome: initialData.nome
    }
  });

  const onSubmit = async (values: AreaFormSchemaType) => {
    try {
      setLoading(true);
      const response = await AreasService('').updateArea(areaId, {
        nome: values.nome
      });

      if (response.info.succeeded) {
        toast.success('Área atualizada com sucesso');
        await queryClient.invalidateQueries({ queryKey: ['areas'] });
        modalClose();
      } else {
        toast.error(getErrorMessage(response, 'Erro ao atualizar área'));
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao atualizar área'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-2">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
          autoComplete="off"
        >
          <div className="grid grid-cols-1 gap-x-8 gap-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Introduza o nome"
                      {...field}
                      className="px-4 py-6 shadow-inner drop-shadow-xl"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button type="button" variant="secondary" onClick={modalClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Atualizando...' : 'Atualizar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AreaUpdateForm;
