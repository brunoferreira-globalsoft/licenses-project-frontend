import { useGetAreasCount } from '@/pages/application/areas/queries/areas-queries';
import { useGetAplicacoesCount } from '@/pages/application/aplicacoes/queries/aplicacoes-queries';

export const useGetDashboardCounts = () => {
  const { data: areasCount, isLoading: isLoadingAreas } = useGetAreasCount();
  const { data: aplicacoesCount, isLoading: isLoadingAplicacoes } =
    useGetAplicacoesCount();

  return {
    areasCount,
    aplicacoesCount,
    isLoading: isLoadingAreas || isLoadingAplicacoes
  };
};
