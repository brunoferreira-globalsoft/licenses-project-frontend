import ProtectedRoute from '@/components/auth/protected-route';
import AplicacoesPage from '@/pages/application/aplicacoes';
import ModulosPage from '@/pages/application/modulos';
import AreasPage from '@/pages/application/areas';
import NotFound from '@/pages/not-found';
import { Suspense, lazy } from 'react';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';
import { HeaderNavProvider } from '@/contexts/header-nav-context';
import FuncionalidadesPage from '@/pages/application/funcionalidades';
import ClientesPage from '@/pages/platform/clientes';
import LicencasPage from '@/pages/platform/licencas';
import AdministracaoPage from '@/pages/administracao';

const DashboardLayout = lazy(
  () => import('@/components/layout/dashboard-layout')
);
const SignInPage = lazy(() => import('@/pages/auth/signin'));
const DashboardPage = lazy(() => import('@/pages/dashboard'));

// ----------------------------------------------------------------------

export default function AppRouter() {
  const dashboardRoutes = [
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <HeaderNavProvider>
            <DashboardLayout>
              <Suspense>
                <Outlet />
              </Suspense>
            </DashboardLayout>
          </HeaderNavProvider>
        </ProtectedRoute>
      ),
      children: [
        {
          element: <DashboardPage />,
          index: true
        },
        {
          path: 'administracao',
          element: <AdministracaoPage />
        },

        {
          path: 'areas',
          element: <AreasPage />
        },
        {
          path: 'aplicacoes',
          element: <AplicacoesPage />
        },
        {
          path: 'modulos',
          element: <ModulosPage />
        },
        {
          path: 'funcionalidades',
          element: <FuncionalidadesPage />
        },
        {
          path: 'clientes',
          element: <ClientesPage />
        },
        {
          path: 'licencas',
          element: <LicencasPage />
        }
      ]
    }
  ];

  const publicRoutes = [
    {
      path: '/login',
      element: <SignInPage />,
      index: true
    },
    {
      path: '/404',
      element: <NotFound />
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />
    }
  ];

  const routes = useRoutes([...dashboardRoutes, ...publicRoutes]);

  return routes;
}
