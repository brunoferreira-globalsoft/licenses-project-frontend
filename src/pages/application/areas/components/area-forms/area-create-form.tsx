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
import { getErrorMessage, handleApiError } from '@/utils/error-handlers';
import { useCreateArea } from '../../queries/areas-mutations';

const areaFormSchema = z.object({
  nome: z
    .string({ required_error: 'O Nome é obrigatório' })
    .min(1, { message: 'O Nome deve ter pelo menos 1 caractere' })
});

type AreaFormSchemaType = z.infer<typeof areaFormSchema>;

const AreaCreateForm = ({ modalClose }: { modalClose: () => void }) => {
  const createAreaMutation = useCreateArea();

  const form = useForm<AreaFormSchemaType>({
    resolver: zodResolver(areaFormSchema),
    defaultValues: {
      nome: ''
    }
  });

  const onSubmit = async (values: AreaFormSchemaType) => {
    try {
      const response = await createAreaMutation.mutateAsync({
        nome: values.nome
      });

      if (response.info.succeeded) {
        toast.success('Área criada com sucesso');
        modalClose();
      } else {
        toast.error(getErrorMessage(response, 'Erro ao criar área'));
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao criar área'));
    }
  };

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form
          id="areaCreateForm"
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
          <div className="flex items-center justify-end space-x-2">
            <Button type="button" variant="outline" onClick={modalClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createAreaMutation.isPending}>
              {createAreaMutation.isPending ? 'Criando...' : 'Criar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AreaCreateForm;
