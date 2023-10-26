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
        title: "Borrower's Form",
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
        path: '/dashboard/profiling_mr', // Replace with the actual path
      },
      {
        title: 'Condemned Items',
        path: '/dashboard/profiling_ci', // Replace with the actual path
      },
    ],
  },
//               REPORTS
  {
    title: 'Reports',
    path: '/dashboard/reports',
    icon: icon('ic_lock'),
    children: [
      {
        title: 'Property Transfer Report',
        path: '/dashboard/reports_ptr',
      },

      {
        title: 'Inventory Transfer Report',
        path: '/dashboard/reports_itr',
      },

      {
        title: 'Monthly Assessment Report',
        path: '/dashboard/reports_mar',
      },

      {
        title: 'Inventory Laboratory Form',
        path: '/dashboard/reports_ilf',
      },
    ],
  },

  {
    title: 'Archives',
    path: '/dashboard/archives',
    icon: icon('ic_blog'),
  },
  {
    title: 'Users',
    path: '/dashboard/user',
    icon: icon('ic_user'),
  },
  {
    title: 'Error',
    path: '/404',
    icon: icon('ic_disabled'),
  },
];

export default navConfig;