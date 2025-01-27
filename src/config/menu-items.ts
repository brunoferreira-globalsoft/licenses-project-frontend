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
  admin: [
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
            description: 'Faça a gestão das aplicações da sua empresa',
            icon: 'application' as keyof typeof Icons
          },
          {
            label: 'Modulos',
            href: '/modulos',
            description: 'Faça a gestão dos modulos da sua empresa',
            icon: 'application' as keyof typeof Icons
          },
          {
            label: 'Funcionalidades',
            href: '/funcionalidades',
            description: 'Faça a gestão das funcionalidades da sua empresa',
            icon: 'application' as keyof typeof Icons
          }
        ]
      },
      {
        label: 'Clientes',
        href: '#',
        items: [
          {
            label: 'Clientes',
            href: '/clientes',
            description: 'Faca a gestão dos clientes da sua empresa'
          },
          {
            label: 'Licenças',
            href: '/licencas',
            description: 'Faça a gestão das licenças da sua empresa',
            icon: 'application' as keyof typeof Icons
          }
        ]
      }
    ]
  },
  admin: {
    administracao: [
      {
        label: 'Licença',
        href: '#',
        items: [
          {
            label: 'Licenças',
            href: '/licencas/admin',
            description: 'Faca a gestão da sua licença'
          }
        ]
      }
    ]
  },
  user: {},
  guest: {}
};
