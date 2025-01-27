import * as React from 'react';
import { Link } from 'react-router-dom';
import { NavigationMenuLink } from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/ui/icons';

interface ListItemProps extends React.ComponentPropsWithoutRef<'a'> {
  title: string;
  to: string;
  icon?: keyof typeof Icons;
}

const ListItem = React.forwardRef<React.ElementRef<'a'>, ListItemProps>(
  ({ className, title, children, to, icon, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <Link
            ref={ref}
            to={to}
            className={cn(
              'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
              className
            )}
            {...props}
          >
            <div className="flex items-center text-sm font-medium leading-none">
              {title}
              {icon && (
                <span className="ml-2">
                  {Icons[icon as keyof typeof Icons]?.({
                    className: 'h-3 w-3'
                  })}
                </span>
              )}
            </div>
            <span className="line-clamp-2 text-xs leading-snug text-muted-foreground">
              {children}
            </span>
          </Link>
        </NavigationMenuLink>
      </li>
    );
  }
);
ListItem.displayName = 'ListItem';

export { ListItem };
