import { NavItem } from '../../@types/NavBar';

export const REMAKE_ITEMS: Array<NavItem> = [
  {
    label: 'remake',
    children: [
      {
        label: 'entel',
        subLabel: 'remake etiqueta entel',
        href: '/label/entel',
      },
    ],
  },
];
export const IMP_ITEMS: Array<NavItem> = [
  {
    label: 'usuarios',
    children: [
      {
        label: 'cadastrar',
        subLabel: 'cadastrar novo usuario',
        href: '/register',
      },
    ],
  },
  {
    label: 'remake',
    children: [
      {
        label: 'entel',
        subLabel: 'remake etiqueta entel',
        href: '/label/entel',
      },
    ],
  },
  {
    label: 'importacao',
    children: [
      {
        label: 'lote',
        subLabel: 'importar lote',
        href: '/upload/batch',
      },
    ],
  },
];
export const ADMIN_ITEMS: Array<NavItem> = [
  {
    label: 'usuarios',
    children: [
      {
        label: 'cadastrar',
        subLabel: 'cadastrar novo usuario',
        href: '/register',
      },
    ],
  },
  {
    label: 'remake',
    children: [
      {
        label: 'entel',
        subLabel: 'remake etiqueta entel',
        href: '/label/entel',
      },
    ],
  },
  {
    label: 'importacao',
    children: [
      {
        label: 'lote',
        subLabel: 'importar lote',
        href: '/upload/batch',
      },
    ],
  },
  {
    label: 'admin',
    children: [
      {
        label: 'lote',
        subLabel: 'importar lote',
        href: '/upload/batch',
      },
    ],
  },
];
