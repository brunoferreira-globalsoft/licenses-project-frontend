import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Switch } from '@/components/ui/switch';
import { useUpdateCliente } from '../../queries/clientes-mutations';
import { toast } from '@/utils/toast-utils';
import { getErrorMessage, handleApiError } from '@/utils/error-handlers';

const clienteFormSchema = z.object({
  nome: z
    .string({ required_error: 'O Nome é obrigatório' })
    .min(1, { message: 'O Nome deve ter pelo menos 1 caractere' }),
  sigla: z
    .string({ required_error: 'A Sigla é obrigatória' })
    .min(1, { message: 'A Sigla deve ter pelo menos 1 caractere' }),
  nif: z
    .string({ required_error: 'O NIF é obrigatório' })
    .length(9, { message: 'O NIF deve ter exatamente 9 caracteres' }),
  ativo: z.boolean(),
  dadosExternos: z.boolean(),
  dadosUrl: z
    .string({ required_error: 'A URL dos dados é obrigatória' })
    .min(1, { message: 'A URL dos dados não pode estar vazia' })
});

type ClienteFormSchemaType = z.infer<typeof clienteFormSchema>;

interface ClienteUpdateFormProps {
  modalClose: () => void;
  clienteId: string;
  initialData: {
    nome: string;
    sigla: string;
    nif?: string;
    ativo: boolean;
    dadosExternos: boolean;
    dadosUrl?: string;
  };
}

const ClienteUpdateForm = ({
  modalClose,
  clienteId,
  initialData
}: ClienteUpdateFormProps) => {
  const updateCliente = useUpdateCliente();

  const form = useForm<ClienteFormSchemaType>({
    resolver: zodResolver(clienteFormSchema),
    defaultValues: {
      nome: initialData.nome,
      sigla: initialData.sigla,
      nif: initialData.nif || '',
      ativo: initialData.ativo,
      dadosExternos: initialData.dadosExternos,
      dadosUrl: initialData.dadosUrl || ''
    }
  });

  const onSubmit = async (data: ClienteFormSchemaType) => {
    try {
      const response = await updateCliente.mutateAsync({
        id: clienteId,
        data: { ...data, id: clienteId }
      });
      if (response.info.succeeded) {
        toast.success('Cliente atualizado com sucesso!');
        modalClose();
      } else {
        toast.error(getErrorMessage(response, 'Erro ao atualizar cliente'));
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao atualizar cliente'));
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        autoComplete="off"
      >
        <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-12">
          <div className="col-span-1 md:col-span-8">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
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

          <div className="col-span-1 md:col-span-4">
            <FormField
              control={form.control}
              name="sigla"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sigla</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Introduza a sigla"
                      {...field}
                      className="px-4 py-6 shadow-inner drop-shadow-xl"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-1 md:col-span-12">
            <div className="grid grid-cols-12 gap-x-8">
              <div className="col-span-4">
                <FormField
                  control={form.control}
                  name="nif"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>NIF</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Introduza o NIF"
                          {...field}
                          className="px-4 py-6 shadow-inner drop-shadow-xl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-8">
                <FormField
                  control={form.control}
                  name="dadosUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL dos Dados</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Introduza a URL dos dados"
                          {...field}
                          className="px-4 py-6 shadow-inner drop-shadow-xl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="col-span-1 md:col-span-12">
            <div className="grid grid-cols-2 gap-x-8">
              <FormField
                control={form.control}
                name="ativo"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Ativo</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dadosExternos"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Dados Externos
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={modalClose}
            className="w-24"
          >
            Cancelar
          </Button>
          <Button type="submit" className="w-24">
            Atualizar
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ClienteUpdateForm;
