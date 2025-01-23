import AplicacoesService from '@/lib/services/application/aplicacoes';
import { useQuery } from '@tanstack/react-query';

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
