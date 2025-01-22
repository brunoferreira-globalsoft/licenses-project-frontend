import Aplicacoes from '@/lib/methods/application/aplicacoes';
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
      Aplicacoes('aplicacoes').getAplicacoesPaginated({
        pageNumber: pageNumber,
        pageSize: pageLimit,
        filters: (filters as unknown as Record<string, string>) ?? undefined,
        sorting: sorting ?? undefined
      })
  });
};
