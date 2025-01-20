import { Icons } from '@/components/ui/icons';

export const roleMenuItems = {
  administrator: [
    {
      title: 'Dashboard',
      href: '/',
      icon: 'dashboard' as keyof typeof Icons,
      label: 'Dashboard'
    },
    {
      title: 'Areas',
      href: '/areas',
      icon: 'user' as keyof typeof Icons,
      label: 'areas'
    }
  ],
  admin: [],
  guest: []
};

export const roleHeaderMenus = {
  administrator: {
    dashboard: [{ label: 'About Us', href: '/about' }],
    areas: [{ label: 'Team', href: '/team' }]
  },
  user: {},
  guest: {}
};
