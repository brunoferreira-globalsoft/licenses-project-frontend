import FuncionalidadesService from '@/lib/services/application/funcionalidade-service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateFuncionalidadeDTO, UpdateFuncionalidadeDTO } from '@/types/dtos';

export const useDeleteFuncionalidade = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      FuncionalidadesService('funcionalidades').deleteFuncionalidade(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['funcionalidades-paginated']
      });
      queryClient.invalidateQueries({
        queryKey: ['funcionalidades-paginated']
      });
      queryClient.invalidateQueries({ queryKey: ['funcionalidades'] });
      queryClient.invalidateQueries({ queryKey: ['funcionalidades-count'] });
      queryClient.invalidateQueries({ queryKey: ['funcionalidades-select'] });
    }
  });
};

export const useCreateFuncionalidade = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFuncionalidadeDTO) =>
      FuncionalidadesService('funcionalidades').createFuncionalidade(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['funcionalidades-paginated']
      });
      queryClient.invalidateQueries({
        queryKey: ['funcionalidades-paginated']
      });
      queryClient.invalidateQueries({ queryKey: ['funcionalidades'] });
      queryClient.invalidateQueries({ queryKey: ['funcionalidades-count'] });
      queryClient.invalidateQueries({ queryKey: ['funcionalidades-select'] });
    }
  });
};

export const useUpdateFuncionalidade = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFuncionalidadeDTO }) =>
      FuncionalidadesService('funcionalidades').updateFuncionalidade(id, {
        ...data,
        id
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['funcionalidades-paginated']
      });
      queryClient.invalidateQueries({
        queryKey: ['funcionalidades-paginated']
      });
      queryClient.invalidateQueries({ queryKey: ['funcionalidades'] });
      queryClient.invalidateQueries({ queryKey: ['funcionalidades-count'] });
      queryClient.invalidateQueries({ queryKey: ['funcionalidades-select'] });
    }
  });
};
