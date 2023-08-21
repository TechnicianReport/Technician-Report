// component
import { Icon } from '@iconify/react';
import SvgColor from '../../../components/svg-color';


// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
  },
 
  {
    title: 'Forms',
    path: '/dashboard/form',
    icon: icon('ic_cart'),
    subNav: [
      {
          title: 'Memorandum of Receipt',
          path: '/',
      },
      {
          title: 'Condemned Item',
          path: '/',
      }
  ]
  },
  {
    title: 'Profiling',
    path: '/dashboard/profiling',
    icon: icon('ic_blog'),
  },
  {
    title: 'Reports',
    path: '/dashboard/report',
    icon: icon('ic_lock'),
  },
  {
    title: 'Archives',
    path: '/dashboard/user',
    icon: <Icon icon="mi:clipboard-list" />,
  },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic_disabled'),
  // },
  {
    title: 'user',
    path: '/dashboard/user',
    icon: icon('ic_user'),
  },
  {
    title: 'login',
    path: '/login',
    icon: icon('ic_lock'),
  },
];

export default navConfig;
