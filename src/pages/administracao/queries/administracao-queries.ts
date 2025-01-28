import { useGetClientesCount } from '@/pages/platform/clientes/queries/clientes-queries';
import { useGetLicencasCount } from '@/pages/platform/licencas/queries/licencas-queries';
import { useGetLicencasPaginated } from '@/pages/platform/licencas/queries/licencas-queries';

export const useGetAdministracaoCounts = () => {
  const { data: clientesCount, isLoading: isLoadingClientes } =
    useGetClientesCount();
  const { data: licencasCount, isLoading: isLoadingLicencas } =
    useGetLicencasCount();
  const { data: licencasResponse, isLoading: isLoadingLicencasData } =
    useGetLicencasPaginated(1, 100, null, null);

  const activeLicencasCount =
    licencasResponse?.info?.data?.filter(
      (lic) => new Date(lic.dataFim) > new Date()
    ).length || 0;

  return {
    clientesCount,
    licencasCount,
    activeLicencasCount,
    isLoading: isLoadingClientes || isLoadingLicencas || isLoadingLicencasData
  };
};
