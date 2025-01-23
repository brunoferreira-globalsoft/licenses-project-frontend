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
import AplicacoesService from '@/lib/services/application/aplicacoes-service';
import { useState } from 'react';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { getErrorMessage, handleApiError } from '@/utils/error-handlers';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import AreasService from '@/lib/services/application/areas-service';

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
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const { data: areasData } = useQuery({
    queryKey: ['areas-select'],
    queryFn: async () => {
      const response = await AreasService('areas').getAreas();
      return response.info.data || [];
    },
    staleTime: 30000
  });

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
      setLoading(true);
      const response = await AplicacoesService('aplicacoes').createAplicacao({
        id: '', // temporary id to satisfy type
        nome: values.nome,
        descricao: values.descricao || '',
        versao: '1.0.0',
        ativo: values.ativo,
        areaId: values.areaId
      });

      if (response.info.succeeded) {
        toast.success('Aplicação criada com sucesso');
        await queryClient.invalidateQueries({ queryKey: ['aplicacoes'] });
        modalClose();
      } else {
        toast.error(getErrorMessage(response, 'Erro ao criar aplicação'));
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao criar aplicação'));
    } finally {
      setLoading(false);
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
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
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
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <Label>Ativo</Label>
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
            <Button type="submit" disabled={loading}>
              {loading ? 'Criando...' : 'Criar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AplicacaoCreateForm;
