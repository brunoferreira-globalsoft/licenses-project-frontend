import { useState } from 'react';
import Sidebar from '@/components/shared/sidebar';
import Header from '@/components/shared/header';
import MobileSidebar from '@/components/shared/mobile-sidebar';
import { MenuIcon } from 'lucide-react';
import { HeaderNav } from '@/components/shared/header-nav';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  return (
    <div className="flex min-h-screen overflow-hidden bg-secondary">
      <MobileSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <Sidebar />
      <div className="flex w-full flex-1 flex-col overflow-hidden">
        <div className="hidden md:block">
          <HeaderNav />
        </div>
        <div className="relative z-10 flex h-20 flex-shrink-0 md:hidden">
          <button
            className="pl-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 xl:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuIcon className="h-6 w-6" aria-hidden="true" />
          </button>
          <Header />
        </div>
        <main className="relative flex-1 overflow-y-auto bg-background md:mx-0 md:my-4 md:mr-4 md:rounded-xl">
          {children}
        </main>
      </div>
    </div>
  );
}
