import AreasService from '@/lib/services/application/areas-service';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetAreas = (
  pageNumber: number,
  pageLimit: number,
  filters: Array<{ id: string; value: string }> | null,
  sorting: string[] | null
) => {
  return useQuery({
    queryKey: ['areas', pageNumber, pageLimit, filters, sorting],
    queryFn: () =>
      AreasService('areas').getAreasPaginated({
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

export const usePrefetchAdjacentAreas = (
  page: number,
  pageSize: number,
  filters: Array<{ id: string; value: string }> | null
) => {
  const queryClient = useQueryClient();

  const prefetchPreviousPage = async () => {
    if (page > 1) {
      await queryClient.prefetchQuery({
        queryKey: ['areas', page - 1, pageSize, filters, null],
        queryFn: () =>
          AreasService('areas').getAreasPaginated({
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
      queryKey: ['areas', page + 1, pageSize, filters, null],
      queryFn: () =>
        AreasService('areas').getAreasPaginated({
          pageNumber: page + 1,
          pageSize: pageSize,
          filters: (filters as unknown as Record<string, string>) ?? undefined,
          sorting: undefined
        })
    });
  };

  return { prefetchPreviousPage, prefetchNextPage };
};
