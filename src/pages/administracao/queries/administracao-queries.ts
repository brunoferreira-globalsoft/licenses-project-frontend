import { useGetClientesCount } from '@/pages/platform/clientes/queries/clientes-queries';
import {
  useGetLicencas,
  useGetLicencasCount
} from '@/pages/platform/licencas/queries/licencas-queries';

export const useGetAdministracaoCounts = () => {
  const { data: clientesCount, isLoading: isLoadingClientes } =
    useGetClientesCount();
  const { data: licencasCount, isLoading: isLoadingLicencas } =
    useGetLicencasCount();
  const { data: licencasResponse, isLoading: isLoadingLicencasData } =
    useGetLicencas();

  const activeLicencasCount =
    licencasResponse?.info?.data?.filter(
      (lic) => lic.dataFim && new Date(lic.dataFim) > new Date()
    ).length || 0;

  console.log(clientesCount);
  console.log(licencasCount);
  console.log(licencasResponse);

  return {
    clientesCount,
    licencasCount,
    activeLicencasCount,
    isLoading: isLoadingClientes || isLoadingLicencas || isLoadingLicencasData
  };
};
