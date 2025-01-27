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
import { toast } from '@/utils/toast-utils';
import { getErrorMessage, handleApiError } from '@/utils/error-handlers';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useGetAplicacoesSelect } from '@/pages/application/aplicacoes/queries/aplicacoes-queries';
import { useUpdateModulo } from '@/pages/application/modulos/queries/modulos-mutations';

const moduloFormSchema = z.object({
  nome: z
    .string({ required_error: 'O Nome é obrigatório' })
    .min(1, { message: 'O Nome deve ter pelo menos 1 caractere' }),
  descricao: z.string().optional(),
  ativo: z.boolean().default(true),
  aplicacaoId: z.string({ required_error: 'A Aplicação é obrigatória' })
});

type ModuloFormSchemaType = z.infer<typeof moduloFormSchema>;

interface ModuloUpdateFormProps {
  modalClose: () => void;
  moduloId: string;
  initialData: {
    nome: string;
    descricao?: string;
    ativo: boolean;
    aplicacaoId: string;
  };
}

const ModuloUpdateForm = ({
  modalClose,
  moduloId,
  initialData
}: ModuloUpdateFormProps) => {
  const { data: aplicacoesData } = useGetAplicacoesSelect();
  const updateModuloMutation = useUpdateModulo();

  const form = useForm<ModuloFormSchemaType>({
    resolver: zodResolver(moduloFormSchema),
    defaultValues: {
      nome: initialData.nome,
      descricao: initialData.descricao || '',
      ativo: initialData.ativo,
      aplicacaoId: initialData.aplicacaoId
    }
  });

  const onSubmit = async (values: ModuloFormSchemaType) => {
    try {
      const response = await updateModuloMutation.mutateAsync({
        id: moduloId,
        data: {
          id: moduloId,
          nome: values.nome,
          descricao: values.descricao || '',
          ativo: values.ativo,
          aplicacaoId: values.aplicacaoId
        }
      });

      if (response.info.succeeded) {
        toast.success('Aplicação atualizada com sucesso');
        modalClose();
      } else {
        toast.error(getErrorMessage(response, 'Erro ao atualizar aplicação'));
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao atualizar aplicação'));
    }
  };

  return (
    <div className="space-y-4">
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

            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Introduza a descrição"
                      {...field}
                      className="shadow-inner drop-shadow-xl"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="aplicacaoId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aplicação</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="px-4 py-6 shadow-inner drop-shadow-xl">
                        <SelectValue placeholder="Selecione uma aplicação" />
                      </SelectTrigger>
                      <SelectContent>
                        {aplicacoesData?.map((aplicacao) => (
                          <SelectItem
                            key={aplicacao.id || ''}
                            value={aplicacao.id || ''}
                          >
                            {aplicacao.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
          </div>

          <div className="flex items-center justify-end space-x-2">
            <Button type="button" variant="outline" onClick={modalClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={updateModuloMutation.isPending}>
              {updateModuloMutation.isPending ? 'Atualizando...' : 'Atualizar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ModuloUpdateForm;
