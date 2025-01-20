import Heading from '@/components/shared/heading';
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
import { useToast } from '@/components/ui/use-toast';
import Areas from '@/lib/methods/application/areas';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

const areaFormSchema = z.object({
  nome: z
    .string({ required_error: 'First name is required' })
    .min(1, { message: 'firstname is should be at least 1 character' })
});

type AreaFormSchemaType = z.infer<typeof areaFormSchema>;

const AreaCreateForm = ({ modalClose }: { modalClose: () => void }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<AreaFormSchemaType>({
    resolver: zodResolver(areaFormSchema),
    defaultValues: {
      nome: ''
    }
  });

  const onSubmit = async (values: AreaFormSchemaType) => {
    try {
      setLoading(true);
      const response = await Areas('areas').createArea({
        nome: values.nome
      });

      console.log('Create Area Response:', response);

      if (response.success) {
        toast({
          title: 'Sucesso',
          description: 'Área criada com sucesso',
          variant: 'default'
        });
        await queryClient.invalidateQueries({ queryKey: ['areas'] });
        modalClose();
      } else {
        toast({
          title: 'Erro',
          description: response.messages.join(', ') || 'Erro ao criar área',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error creating area:', error);

      const errorMessage =
        error instanceof Error ? error.message : 'Erro ao criar área';

      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-2">
      {/* <div className="flex items-center justify-center text-2xl font-bold">
        {'<Logo/>'}
      </div> */}

      <Heading
        title={'Criar Nova Área'}
        description={''}
        className="space-y-2 py-4 text-center"
      />
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
                      className=" px-4 py-6 shadow-inner drop-shadow-xl"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button
              type="button"
              variant="secondary"
              className="rounded-full "
              size="lg"
              onClick={modalClose}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="rounded-full"
              size="lg"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Criar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AreaCreateForm;
