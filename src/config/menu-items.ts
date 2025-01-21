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
    administracao: [
      {
        label: 'Plataforma',
        href: '#',
        items: [
          {
            label: 'Áreas',
            href: '/areas',
            description: 'Faca a gestão das áreas da sua empresa'
          },
          {
            label: 'Aplicações',
            href: '/aplicacoes',
            description: 'Faça a gestão das aplicações da sua empresa'
          }
        ]
      }
    ]
  },
  user: {},
  guest: {}
};
