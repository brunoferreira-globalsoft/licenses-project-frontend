import Areas from '@/lib/methods/application/areas';
import { useQuery } from '@tanstack/react-query';

export const useGetAreas = (
  pageNumber: number,
  pageLimit: number,
  search: string | null,
  sorting: string[] | null
) => {
  return useQuery({
    queryKey: ['areas', pageNumber, pageLimit, search, sorting],
    queryFn: () =>
      Areas('areas').getAreasPaginated({
        pageNumber: pageNumber,
        pageSize: pageLimit,
        keyword: search ?? undefined,
        sorting: sorting ?? undefined
      })
  });
};
