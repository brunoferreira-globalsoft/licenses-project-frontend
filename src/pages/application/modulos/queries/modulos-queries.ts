import ModulosService from '@/lib/services/application/modulos-service';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetModulos = (
  pageNumber: number,
  pageLimit: number,
  filters: Array<{ id: string; value: string }> | null,
  sorting: string[] | null
) => {
  return useQuery({
    queryKey: ['modulos', pageNumber, pageLimit, filters, sorting],
    queryFn: () =>
      ModulosService('modulos').getModulosPaginated({
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

export const usePrefetchAdjacentModulos = (
  page: number,
  pageSize: number,
  filters: Array<{ id: string; value: string }> | null
) => {
  const queryClient = useQueryClient();

  const prefetchPreviousPage = async () => {
    if (page > 1) {
      await queryClient.prefetchQuery({
        queryKey: ['modulos', page - 1, pageSize, filters, null],
        queryFn: () =>
          ModulosService('modulos').getModulosPaginated({
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
      queryKey: ['modulos', page + 1, pageSize, filters, null],
      queryFn: () =>
        ModulosService('modulos').getModulosPaginated({
          pageNumber: page + 1,
          pageSize: pageSize,
          filters: (filters as unknown as Record<string, string>) ?? undefined,
          sorting: undefined
        })
    });
  };

  return { prefetchPreviousPage, prefetchNextPage };
};

export const useGetModulosCount = () => {
  return useQuery({
    queryKey: ['modulos-count'],
    queryFn: async () => {
      const response = await ModulosService('modulos').getModulos();
      return response.info?.data?.length || 0;
    }
  });
};
