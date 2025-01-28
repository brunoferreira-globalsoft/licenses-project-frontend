import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useGetLicencas } from '@/pages/platform/licencas/queries/licencas-queries';
import { subDays } from 'date-fns';

interface AreaCount {
  name: string;
  total: number;
  active: number;
  expired: number;
}

export default function AreasComMaisLicencas() {
  const { data: licencasResponse, isLoading, error } = useGetLicencas();
  const licencas = licencasResponse?.info?.data || [];

  console.log(licencas);

  if (isLoading) {
    return (
      <div className="flex h-[350px] items-center justify-center">
        <p>Carregando dados...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[350px] items-center justify-center">
        <p className="text-destructive">Erro ao carregar dados</p>
      </div>
    );
  }

  if (!licencas.length) {
    return (
      <div className="flex h-[350px] items-center justify-center">
        <p className="text-muted-foreground">Nenhuma licença encontrada</p>
      </div>
    );
  }

  // Filter licenses from last 30 days
  const thirtyDaysAgo = subDays(new Date(), 30);
  const recentLicencas = licencas.filter(
    (lic) => lic.dataInicio && new Date(lic.dataInicio) >= thirtyDaysAgo
  );

  // Process data to count licenses by area
  const processedData = recentLicencas.reduce<AreaCount[]>((acc, lic) => {
    const areaName = lic.aplicacao?.area?.nome || 'Sem área';
    const isActive = lic.dataFim && new Date(lic.dataFim) > new Date();

    const existingArea = acc.find((item) => item.name === areaName);
    if (existingArea) {
      existingArea.total++;
      isActive ? existingArea.active++ : existingArea.expired++;
    } else {
      acc.push({
        name: areaName,
        total: 1,
        active: isActive ? 1 : 0,
        expired: isActive ? 0 : 1
      });
    }
    return acc;
  }, []);

  // Sort by total and get top 5
  const topAreas = processedData
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)
    .map((area) => ({
      ...area,
      name: area.name.length > 20 ? `${area.name.slice(0, 20)}...` : area.name
    }));

  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={topAreas}
          margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
        >
          <XAxis
            dataKey="name"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip
            cursor={{ fill: 'transparent' }}
            contentStyle={{
              backgroundColor: 'var(--background)',
              border: '1px solid var(--border)'
            }}
          />
          <Legend />
          <Bar
            dataKey="active"
            name="Ativas"
            fill="hsl(var(--success))"
            radius={[4, 4, 0, 0]}
            stackId="stack"
          />
          <Bar
            dataKey="expired"
            name="Expiradas"
            fill="hsl(var(--destructive))"
            radius={[4, 4, 0, 0]}
            stackId="stack"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
