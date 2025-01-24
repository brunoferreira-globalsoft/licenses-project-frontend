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
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useGetAreasSelect } from '@/pages/application/areas/queries/areas-queries';
import { useCreateAplicacao } from '@/pages/application/aplicacoes/queries/aplicacoes-mutations';
import { toast } from '@/utils/toast-utils';
import { getErrorMessage, handleApiError } from '@/utils/error-handlers';

const aplicacaoFormSchema = z.object({
  nome: z
    .string({ required_error: 'O Nome é obrigatório' })
    .min(1, { message: 'O Nome deve ter pelo menos 1 caractere' }),
  descricao: z
    .string({ required_error: 'A Descrição é obrigatória' })
    .min(1, { message: 'A Descrição deve ter pelo menos 1 caractere' }),
  ativo: z.boolean(),
  areaId: z.string({ required_error: 'A Área é obrigatória' })
});

type AplicacaoFormSchemaType = z.infer<typeof aplicacaoFormSchema>;

const AplicacaoCreateForm = ({ modalClose }: { modalClose: () => void }) => {
  const { data: areasData } = useGetAreasSelect();
  const createAplicacaoMutation = useCreateAplicacao();

  const form = useForm<AplicacaoFormSchemaType>({
    resolver: zodResolver(aplicacaoFormSchema),
    defaultValues: {
      nome: '',
      descricao: '',
      ativo: true,
      areaId: ''
    }
  });

  const onSubmit = async (values: AplicacaoFormSchemaType) => {
    try {
      const response = await createAplicacaoMutation.mutateAsync({
        nome: values.nome,
        descricao: values.descricao || '',
        versao: '1.0.0',
        ativo: values.ativo,
        areaId: values.areaId
      });

      if (response.info.succeeded) {
        toast.success('Aplicação criada com sucesso');
        modalClose();
      } else {
        toast.error(getErrorMessage(response, 'Erro ao criar aplicação'));
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao criar aplicação'));
    }
  };

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form
          id="aplicacaoCreateForm"
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
              name="areaId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Área</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="px-4 py-6 shadow-inner drop-shadow-xl">
                        <SelectValue placeholder="Selecione uma área" />
                      </SelectTrigger>
                      <SelectContent>
                        {areasData?.map((area) => (
                          <SelectItem key={area.id || ''} value={area.id || ''}>
                            {area.nome}
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
                <FormItem>
                  <div className="flex items-center space-x-2">
                    <FormLabel>Ativo</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex items-center justify-end space-x-2">
            <Button type="button" variant="outline" onClick={modalClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createAplicacaoMutation.isPending}>
              {createAplicacaoMutation.isPending ? 'Criando...' : 'Criar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AplicacaoCreateForm;
