import { Icons } from '@/components/ui/icons';

export const roleMenuItems = {
  administrator: [
    {
      title: 'dashboard',
      href: '/',
      icon: 'dashboard' as keyof typeof Icons,
      label: 'Dashboard'
    },
    {
      title: 'administracao',
      href: '/administracao',
      icon: 'user' as keyof typeof Icons,
      label: 'Administração'
    }
  ],
  admin: [],
  guest: []
};

export const roleHeaderMenus = {
  administrator: {
    dashboard: [
      {
        label: 'About Us',
        href: '/about'
      }
    ],
    administracao: [
      {
        label: 'Plataforma',
        href: '#',
        items: [
          {
            label: 'Áreas',
            href: '/areas'
          },
          {
            label: 'Aplicações',
            href: '/aplicacaoes'
          }
        ]
      },
      {
        label: 'Student',
        href: '/student'
      }
    ]
  },
  user: {},
  guest: {}
};
