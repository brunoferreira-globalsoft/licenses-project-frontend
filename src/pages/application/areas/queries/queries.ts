import Areas from '@/lib/methods/application/areas';
import { useQuery } from '@tanstack/react-query';

export const useGetAreas = (
  offset: number,
  pageLimit: number,
  search: string | null
) => {
  return useQuery({
    queryKey: ['areas', offset, pageLimit, search],
    queryFn: () =>
      Areas('areas').getAreasPaginated({
        pageNumber: offset,
        pageSize: pageLimit,
        keyword: search ?? undefined
      })
  });
};
