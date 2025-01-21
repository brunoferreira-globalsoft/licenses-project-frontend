import Aplicacoes from '@/lib/methods/application/aplicacoes';
import { useQuery } from '@tanstack/react-query';

export const useGetAplicacoes = (
  pageNumber: number,
  pageLimit: number,
  search: string | null,
  sorting: string[] | null
) => {
  return useQuery({
    queryKey: ['areas', pageNumber, pageLimit, search, sorting],
    queryFn: () =>
      Aplicacoes('aplicacoes').getAplicacoesPaginated({
        pageNumber: pageNumber,
        pageSize: pageLimit,
        keyword: search ?? undefined,
        sorting: sorting ?? undefined
      })
  });
};
