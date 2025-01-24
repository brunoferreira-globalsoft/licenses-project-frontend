import AplicacoesService from '@/lib/services/application/aplicacoes-service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateAplicacaoDTO, UpdateAplicacaoDTO } from '@/types/entities';

export const useDeleteAplicacao = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      AplicacoesService('aplicacoes').deleteAplicacao(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aplicacoes'] });
      queryClient.invalidateQueries({ queryKey: ['aplicacoes-count'] });
    }
  });
};

export const useCreateAplicacao = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateAplicacaoDTO) =>
      AplicacoesService('aplicacoes').createAplicacao(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aplicacoes'] });
      queryClient.invalidateQueries({ queryKey: ['aplicacoes-count'] });
    }
  });
};

export const useUpdateAplicacao = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAplicacaoDTO }) =>
      AplicacoesService('aplicacoes').updateAplicacao(id, { ...data, id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aplicacoes'] });
      queryClient.invalidateQueries({ queryKey: ['aplicacoes-count'] });
    }
  });
};
