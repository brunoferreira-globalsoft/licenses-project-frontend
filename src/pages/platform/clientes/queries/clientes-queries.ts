import ClientesService from '@/lib/services/platform/clientes-service';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetClientes = (
  pageNumber: number,
  pageLimit: number,
  filters: Array<{ id: string; value: string }> | null,
  sorting: string[] | null
) => {
  return useQuery({
    queryKey: ['clientes', pageNumber, pageLimit, filters, sorting],
    queryFn: () =>
      ClientesService('clientes').getClientesPaginated({
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

export const usePrefetchAdjacentClientes = (
  page: number,
  pageSize: number,
  filters: Array<{ id: string; value: string }> | null
) => {
  const queryClient = useQueryClient();

  const prefetchPreviousPage = async () => {
    if (page > 1) {
      await queryClient.prefetchQuery({
        queryKey: ['clientes', page - 1, pageSize, filters, null],
        queryFn: () =>
          ClientesService('clientes').getClientesPaginated({
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
      queryKey: ['clientes', page + 1, pageSize, filters, null],
      queryFn: () =>
        ClientesService('clientes').getClientesPaginated({
          pageNumber: page + 1,
          pageSize: pageSize,
          filters: (filters as unknown as Record<string, string>) ?? undefined,
          sorting: undefined
        })
    });
  };

  return { prefetchPreviousPage, prefetchNextPage };
};

export const useGetClientesSelect = () => {
  return useQuery({
    queryKey: ['clientes-select'],
    queryFn: async () => {
      const response = await ClientesService('clientes').getClientes();
      return response.info.data || [];
    },
    staleTime: 30000
  });
};

export const useGetClientesCount = () => {
  return useQuery({
    queryKey: ['clientes-count'],
    queryFn: async () => {
      const response = await ClientesService('clientes').getClientes();
      return response.info?.data?.length || 0;
    }
  });
};
