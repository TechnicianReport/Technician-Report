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
 //                  FORMS
  {
    title: 'Forms',
    path: '/dashboard/form',
    icon: icon('ic_cart'),
    children: [
      {
        title: 'Service Request Form',
        path: '/dashboard/service_request',
      },
      {
        title: 'Borrowers Item Form',
        path: '/dashboard/borrowers_item',
      },
      {
        title: 'Request Item Form',
        path: '/dashboard/request_item',
      },
      {
        title: 'Inspection Report Form',
        path: '/dashboard/inspection_report',
      },
    ],
  },
//             PROFILING
  {
    title: 'Profiling',
    path: '/dashboard/profiling',
    icon: icon('ic_blog'),
    children: [
      {
        title: 'Memorandum of Receipts',
        path: '/dashboard/profiling/mr', // Replace with the actual path
      },
      {
        title: 'Condemned Items',
        path: '/dashboard/profiling/condemned', // Replace with the actual path
      },
    ],
  },
//               REPORTS
  {
    title: 'Reports',
    path: '/dashboard/report',
    icon: icon('ic_lock'),
    children: [
      {
        title: 'Inspection Report',
        path: '/dashboard/report/inspection',
      },
      {
        title: 'Receipt of Returned Semi Expandable Property',
        path: '/dashboard/report/rrsp',
      },
      {
        title: 'Inventory Transfer Report',
        path: '/dashboard/report/itr',
      },
    ],
  },

  {
    title: 'Archives',
    path: '/dashboard/user',
    icon: icon('ic_blog'),
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
