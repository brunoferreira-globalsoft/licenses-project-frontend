import { Link, useLocation } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/shared/theme-toggle';
import UserNav from '@/components/shared/user-nav';
import { useHeaderNav } from '@/contexts/header-nav-context';
import { useHeaderMenu } from '@/hooks/use-header-menu';
import { cn } from '@/lib/utils';
import { Logo } from '@/assets/logo-letters';

interface MenuItem {
  href: string;
  label: string;
  description?: string;
  items?: MenuItem[];
}

export function HeaderNav() {
  const location = useLocation();
  const { currentMenu } = useHeaderNav();
  const menuItems = useHeaderMenu(currentMenu) as MenuItem[];

  const isItemActive = (href: string) => {
    // Check for exact match
    if (location.pathname === href) return true;

    // Check for nested routes
    if (href !== '/' && location.pathname.startsWith(href + '/')) return true;

    // For administration menu, check if current path is in its submenu paths
    if (href === '/administracao') {
      return ['/areas', '/aplicacoes'].some((path) =>
        location.pathname.startsWith(path)
      );
    }

    return false;
  };

  return (
    <div className="border-b bg-background">
      <div className="flex h-16 items-center px-4">
        <div className="mr-6 flex items-center space-x-2">
          <Logo width={95} className="text-primary" disableLink />
        </div>
        <NavigationMenu>
          <NavigationMenuList>
            {menuItems.map((item, index) => (
              <NavigationMenuItem key={index}>
                {item.items ? (
                  <>
                    <NavigationMenuTrigger
                      triggerMode="click"
                      className={cn(
                        item.items.some((subItem) =>
                          isItemActive(subItem.href)
                        ) && 'bg-accent text-accent-foreground'
                      )}
                    >
                      {item.label}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                        {item.items.map((subItem, subIndex) => (
                          <Link key={subIndex} to={subItem.href}>
                            <div className="group block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                              <div className="text-sm font-medium leading-none">
                                {subItem.label}
                              </div>
                              {subItem.description && (
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                  {subItem.description}
                                </p>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </>
                ) : (
                  <Link to={item.href}>
                    <Button
                      variant="ghost"
                      className={cn(
                        isItemActive(item.href) &&
                          'bg-accent text-accent-foreground'
                      )}
                    >
                      {item.label}
                    </Button>
                  </Link>
                )}
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
