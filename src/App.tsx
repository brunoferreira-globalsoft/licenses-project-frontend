import AppProvider from './providers';
import AppRouter from './routes';
import { HeaderNavProvider } from '@/contexts/header-nav-context';

export default function App() {
  return (
    <HeaderNavProvider>
      <AppProvider>
        <AppRouter />
      </AppProvider>
    </HeaderNavProvider>
  );
}
