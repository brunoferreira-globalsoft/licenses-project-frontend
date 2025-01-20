import { useAuthStore } from '@/stores/auth-store';
import { roleHeaderMenus } from '@/config/menu-items';

export const useHeaderMenu = (currentMenu: string) => {
  const roleId = useAuthStore((state) => state.roleId);
  const role = roleId?.toLowerCase() || 'guest';

  const menuItems =
    roleHeaderMenus[role as keyof typeof roleHeaderMenus] ||
    roleHeaderMenus.guest;
  return menuItems[currentMenu as keyof typeof menuItems] || [];
};
