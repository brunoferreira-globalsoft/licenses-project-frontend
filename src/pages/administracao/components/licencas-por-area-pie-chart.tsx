import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';
import { useGetLicencas } from '@/pages/platform/licencas/queries/licencas-queries';
import { subDays } from 'date-fns';
import { getAreaColors } from '@/lib/constants/area-colors';

interface AreaCount {
  name: string;
  value: number;
}

export default function LicencasPorAreaPieChart() {
  const { data: licencasResponse, isLoading, error } = useGetLicencas();
  const licencas = licencasResponse?.info?.data || [];

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

    const existingArea = acc.find((item) => item.name === areaName);
    if (existingArea) {
      existingArea.value++;
    } else {
      acc.push({
        name: areaName,
        value: 1
      });
    }
    return acc;
  }, []);

  // Sort by value and get top 5
  const topAreas = processedData
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)
    .map((area) => ({
      ...area,
      name: area.name.length > 20 ? `${area.name.slice(0, 20)}...` : area.name
    }));

  const areaNames = topAreas.map((area) => area.name);
  const colors = getAreaColors(areaNames);

  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={topAreas}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name} (${(percent * 100).toFixed(0)}%)`
            }
            outerRadius={130}
            fill="#8884d8"
            dataKey="value"
          >
            {topAreas.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
