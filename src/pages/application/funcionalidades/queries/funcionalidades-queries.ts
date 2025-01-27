import FuncionalidadesService from '@/lib/services/application/funcionalidade-service';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetFuncionalidades = (
  pageNumber: number,
  pageLimit: number,
  filters: Array<{ id: string; value: string }> | null,
  sorting: string[] | null
) => {
  return useQuery({
    queryKey: ['funcionalidades', pageNumber, pageLimit, filters, sorting],
    queryFn: () =>
      FuncionalidadesService('funcionalidades').getFuncionalidadesPaginated({
        pageNumber: pageNumber,
        pageSize: pageLimit,
        filters: (filters as unknown as Record<string, string>) ?? undefined,
        sorting: sorting ?? undefined
      }),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000
  });
};

export const usePrefetchAdjacentFuncionalidades = (
  page: number,
  pageSize: number,
  filters: Array<{ id: string; value: string }> | null
) => {
  const queryClient = useQueryClient();

  const prefetchPreviousPage = async () => {
    if (page > 1) {
      await queryClient.prefetchQuery({
        queryKey: ['funcionalidades', page - 1, pageSize, filters, null],
        queryFn: () =>
          FuncionalidadesService('funcionalidades').getFuncionalidadesPaginated(
            {
              pageNumber: page - 1,
              pageSize: pageSize,
              filters:
                (filters as unknown as Record<string, string>) ?? undefined,
              sorting: undefined
            }
          )
      });
    }
  };

  const prefetchNextPage = async () => {
    await queryClient.prefetchQuery({
      queryKey: ['funcionalidades', page + 1, pageSize, filters, null],
      queryFn: () =>
        FuncionalidadesService('funcionalidades').getFuncionalidadesPaginated({
          pageNumber: page + 1,
          pageSize: pageSize,
          filters: (filters as unknown as Record<string, string>) ?? undefined,
          sorting: undefined
        })
    });
  };

  return { prefetchPreviousPage, prefetchNextPage };
};

export const useGetFuncionalidadesCount = () => {
  return useQuery({
    queryKey: ['funcionalidades-count'],
    queryFn: async () => {
      const response =
        await FuncionalidadesService('funcionalidades').getFuncionalidades();
      return response.info?.data?.length || 0;
    }
  });
};

export const useGetFuncionalidadesSelect = () => {
  return useQuery({
    queryKey: ['funcionalidades-select'],
    queryFn: async () => {
      const response =
        await FuncionalidadesService('funcionalidades').getFuncionalidades();
      return response.info.data || [];
    },
    staleTime: 30000
  });
};
