import { Link, useLocation } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/shared/theme-toggle';
import UserNav from '@/components/shared/user-nav';
import { useHeaderNav } from '@/contexts/header-nav-context';
import { useHeaderMenu } from '@/hooks/use-header-menu';
import { cn } from '@/lib/utils';
import { Logo } from '@/assets/logo-letters';
import { useSidebar } from '@/hooks/use-sidebar';

interface MenuItem {
  href: string;
  label: string;
}

export function HeaderNav() {
  const { currentMenu } = useHeaderNav();
  const location = useLocation();
  const currentMenuItems = useHeaderMenu(currentMenu) as MenuItem[];
  const { isMinimized, toggle } = useSidebar();

  return (
    <div className="border-b bg-background">
      <div className="flex h-16 items-center px-4">
        <div className="mr-6 flex items-center space-x-2">
          <Logo width={95} className="text-foreground" disableLink />
        </div>
        <NavigationMenu>
          <NavigationMenuList>
            {currentMenuItems.map((item, index) => (
              <NavigationMenuItem key={index}>
                <Link to={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      location.pathname === item.href &&
                        'bg-accent text-accent-foreground'
                    )}
                  >
                    {item.label}
                  </Button>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <div className="ml-auto flex items-center space-x-4">
          {/* {isMinimized && (
            <Button
              variant="outline"
              size="icon"
              onClick={toggle}
              className="mr-2"
            >
              <ChevronsLeft className="h-[1.2rem] w-[1.2rem] rotate-180" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          )} */}
          <ModeToggle />
          <UserNav />
        </div>
      </div>
    </div>
  );
}
