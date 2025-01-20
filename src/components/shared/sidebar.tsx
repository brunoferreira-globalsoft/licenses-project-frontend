'use client';
import DashboardNav from '@/components/shared/dashboard-nav';
import { useSidebar } from '@/hooks/use-sidebar';
import { useMenuItems } from '@/hooks/use-menu-items';
import { cn } from '@/lib/utils';
import { ChevronsLeft } from 'lucide-react';
import { useState } from 'react';
import { Logo } from '@/assets/logo';

type SidebarProps = {
  className?: string;
};

export default function Sidebar({ className }: SidebarProps) {
  const { isMinimized, toggle } = useSidebar();
  const [status, setStatus] = useState(false);
  const menuItems = useMenuItems();

  const handleToggle = () => {
    setStatus(true);
    toggle();
    setTimeout(() => setStatus(false), 500);
  };

  return (
    <nav
      className={cn(
        `relative z-10 hidden h-screen flex-none px-3 md:block`,
        status && 'duration-500',
        !isMinimized ? 'w-72' : 'w-[80px]',
        className
      )}
    >
      <div
        className={cn(
          'flex items-center px-0 py-5 md:px-2',
          isMinimized ? 'justify-center' : 'justify-between'
        )}
      >
        <div
          className={cn(isMinimized && 'cursor-pointer')}
          onClick={isMinimized ? handleToggle : undefined}
        >
          <Logo
            width={isMinimized ? 40 : 95}
            className="text-foreground"
            disableLink={true}
          />
        </div>
        {!isMinimized && (
          <div
            className="flex size-8 cursor-pointer items-center justify-center rounded-full border bg-background text-foreground"
            onClick={handleToggle}
          >
            <ChevronsLeft
              className={cn('size-4', isMinimized && 'rotate-180')}
            />
          </div>
        )}
      </div>
      <div className="space-y-4 py-4">
        <div className="px-2 py-2">
          <div className="mt-3 space-y-1">
            <DashboardNav items={menuItems} />
          </div>
        </div>
      </div>
    </nav>
  );
}
