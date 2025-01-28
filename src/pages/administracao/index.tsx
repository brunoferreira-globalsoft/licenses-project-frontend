import PageHead from '@/components/shared/page-head';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AreasComMaisLicencas from './components/areas-com-mais-licencas-chart';
import { useGetAdministracaoCounts } from './queries/administracao-queries';
import LicencasPorAreaPieChart from './components/licencas-por-area-pie-chart';
import LicencasAExpirarChart from './components/licencas-a-expirar-chart';

export default function AdministracaoPage() {
  const { clientesCount, licencasCount, activeLicencasCount, isLoading } =
    useGetAdministracaoCounts();

  return (
    <>
      <PageHead title="Administração | GSLP" />
      <div className="flex-1 space-y-4 overflow-y-auto p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Administração do Sistema
          </h2>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Resumo</TabsTrigger>
            <TabsTrigger value="analytics" disabled>
              Analítico
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total de Clientes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoading ? '...' : clientesCount}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Clientes registados
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total de Licenças
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoading ? '...' : licencasCount}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Licenças registadas
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Licenças Ativas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoading ? '...' : activeLicencasCount}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Licenças em vigor
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-1 gap-4 pb-4 md:grid-cols-2 lg:grid-cols-12">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Áreas com mais licenças</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <AreasComMaisLicencas />
                </CardContent>
              </Card>
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Distribuição de Licenças por Área</CardTitle>
                  <CardDescription>Últimos 30 dias</CardDescription>
                </CardHeader>
                <CardContent>
                  <LicencasPorAreaPieChart />
                </CardContent>
              </Card>
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Licenças a Expirar</CardTitle>
                  <CardDescription>Próximos 30 dias</CardDescription>
                </CardHeader>
                <CardContent>
                  <LicencasAExpirarChart />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
