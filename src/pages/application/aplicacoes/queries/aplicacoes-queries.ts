import AplicacoesService from '@/lib/services/application/aplicacoes-service';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import AreasService from '@/lib/services/application/areas-service';

export const useGetAplicacoes = (
  pageNumber: number,
  pageLimit: number,
  filters: Array<{ id: string; value: string }> | null,
  sorting: string[] | null
) => {
  return useQuery({
    queryKey: ['aplicacoes', pageNumber, pageLimit, filters, sorting],
    queryFn: () =>
      AplicacoesService('aplicacoes').getAplicacoesPaginated({
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

export const usePrefetchAdjacentAplicacoes = (
  page: number,
  pageSize: number,
  filters: Array<{ id: string; value: string }> | null
) => {
  const queryClient = useQueryClient();

  const prefetchPreviousPage = async () => {
    if (page > 1) {
      await queryClient.prefetchQuery({
        queryKey: ['aplicacoes', page - 1, pageSize, filters, null],
        queryFn: () =>
          AplicacoesService('aplicacoes').getAplicacoesPaginated({
            pageNumber: page - 1,
            pageSize: pageSize,
            filters:
              (filters as unknown as Record<string, string>) ?? undefined,
            sorting: undefined
          })
      });
    }
  };

  const prefetchNextPage = async () => {
    await queryClient.prefetchQuery({
      queryKey: ['aplicacoes', page + 1, pageSize, filters, null],
      queryFn: () =>
        AplicacoesService('aplicacoes').getAplicacoesPaginated({
          pageNumber: page + 1,
          pageSize: pageSize,
          filters: (filters as unknown as Record<string, string>) ?? undefined,
          sorting: undefined
        })
    });
  };

  return { prefetchPreviousPage, prefetchNextPage };
};

export const useGetAreasSelect = () => {
  return useQuery({
    queryKey: ['areas-select'],
    queryFn: async () => {
      const response = await AreasService('areas').getAreas();
      return response.info.data || [];
    },
    staleTime: 30000
  });
};

export const useGetAplicacoesCount = () => {
  return useQuery({
    queryKey: ['aplicacoes-count'],
    queryFn: async () => {
      const response = await AplicacoesService('aplicacoes').getAplicacoes();
      return response.info?.data?.length || 0;
    }
  });
};
