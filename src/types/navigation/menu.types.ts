export interface MenuItem {
  label: string;
  href: string;
  items?: MenuItem[];
  description?: string;
  icon?: React.ReactNode;
}

export interface HeaderMenu {
  [key: string]: MenuItem[];
}

export interface RoleHeaderMenus {
  [role: string]: {
    [menu: string]: MenuItem[];
  };
}
