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
import { useGetAreasSelect } from '@/pages/application/areas/queries/areas-queries';
import { useUpdateAplicacao } from '@/pages/application/aplicacoes/queries/aplicacoes-mutations';

const aplicacaoFormSchema = z.object({
  nome: z
    .string({ required_error: 'O Nome é obrigatório' })
    .min(1, { message: 'O Nome deve ter pelo menos 1 caractere' }),
  descricao: z.string().optional(),
  ativo: z.boolean().default(true),
  areaId: z.string({ required_error: 'A Área é obrigatória' })
});

type AplicacaoFormSchemaType = z.infer<typeof aplicacaoFormSchema>;

interface AplicacaoUpdateFormProps {
  modalClose: () => void;
  aplicacaoId: string;
  initialData: {
    nome: string;
    descricao?: string;
    ativo: boolean;
    areaId: string;
    versao: string;
  };
}

const AplicacaoUpdateForm = ({
  modalClose,
  aplicacaoId,
  initialData
}: AplicacaoUpdateFormProps) => {
  const { data: areasData } = useGetAreasSelect();
  const updateAplicacaoMutation = useUpdateAplicacao();

  const form = useForm<AplicacaoFormSchemaType>({
    resolver: zodResolver(aplicacaoFormSchema),
    defaultValues: {
      nome: initialData.nome,
      descricao: initialData.descricao || '',
      ativo: initialData.ativo,
      areaId: initialData.areaId
    }
  });

  const onSubmit = async (values: AplicacaoFormSchemaType) => {
    try {
      const response = await updateAplicacaoMutation.mutateAsync({
        id: aplicacaoId,
        data: {
          nome: values.nome,
          descricao: values.descricao || '',
          ativo: values.ativo,
          areaId: values.areaId,
          id: aplicacaoId,
          versao: initialData.versao
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
              name="areaId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Área</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
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
            <Button type="submit" disabled={updateAplicacaoMutation.isPending}>
              {updateAplicacaoMutation.isPending
                ? 'Atualizando...'
                : 'Atualizar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AplicacaoUpdateForm;
