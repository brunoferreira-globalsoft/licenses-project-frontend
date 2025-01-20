'use client';
import { Icons } from '@/components/ui/icons';
import { cn } from '@/lib/utils';
import { NavItem } from '@/types';
import { Dispatch, SetStateAction } from 'react';
import { useSidebar } from '@/hooks/use-sidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { usePathname } from '@/routes/hooks';
import { Link } from 'react-router-dom';
import { useHeaderNav } from '@/contexts/header-nav-context';
import { useLocation } from 'react-router-dom';

interface DashboardNavProps {
  items: NavItem[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
  isMobileNav?: boolean;
}

export default function DashboardNav({
  items,
  setOpen,
  isMobileNav = false
}: DashboardNavProps) {
  const path = usePathname();
  const { isMinimized } = useSidebar();
  const { setCurrentMenu } = useHeaderNav();
  const location = useLocation();

  const menuItems = {
    dashboard1: ['/about', '/team'],
    dashboard2: ['/contact', '/support']
  };

  const handleMenuClick = (title: string) => {
    setCurrentMenu(title.toLowerCase());
    if (setOpen) setOpen(false);
  };

  const isItemActive = (itemTitle: string, itemHref: string) => {
    const currentPaths =
      menuItems[itemTitle.toLowerCase() as keyof typeof menuItems] || [];
    return (
      location.pathname === itemHref || currentPaths.includes(location.pathname)
    );
  };

  if (!items?.length) {
    return null;
  }

  console.log('isActive', isMobileNav, isMinimized);

  return (
    <nav className="grid items-start gap-2">
      <TooltipProvider>
        {items.map((item, index) => {
          const Icon = Icons[item.icon || 'arrowRight'];
          return (
            item.href && (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Link
                    to={item.disabled ? '/' : item.href}
                    className={cn(
                      'flex items-center gap-2 overflow-hidden rounded-md py-2 text-sm font-medium hover:text-muted-foreground',
                      isItemActive(item.title, item.href)
                        ? 'bg-white text-black hover:text-black'
                        : 'transparent',
                      item.disabled && 'cursor-not-allowed opacity-80'
                    )}
                    onClick={() => {
                      handleMenuClick(item.title);
                    }}
                  >
                    <Icon className={`ml-2.5 size-5`} />

                    {isMobileNav || (!isMinimized && !isMobileNav) ? (
                      <span className="mr-2 truncate">{item.title}</span>
                    ) : (
                      ''
                    )}
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  align="center"
                  side="right"
                  sideOffset={8}
                  className={!isMinimized ? 'hidden' : 'inline-block'}
                >
                  {item.title}
                </TooltipContent>
              </Tooltip>
            )
          );
        })}
      </TooltipProvider>
    </nav>
  );
}
