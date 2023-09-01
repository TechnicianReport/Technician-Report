import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import Forms from './pages/Form';
import Profiling from './pages/Profiling';
import Report from './pages/Report';
import FormServiceRequest from './pages/FormServiceRequest';
import FormBorrowersItem from './pages/FormBorrowersItem';
import FormRequestItem from './pages/FormRequestItem';
import FormInspectionReport from './pages/FormInspectionReport';


// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'user', element: <UserPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
        { path: 'form', element: <Forms/>}, 
        { path: 'service_request', element: <FormServiceRequest/>}, 
        { path: 'borrowers_item', element: <FormBorrowersItem/>},
        { path: 'request_item', element: <FormRequestItem/>},
        { path: 'inspection_report', element: <FormInspectionReport/>},
        { path: 'profiling', element: <Profiling/> },
        { path: 'report', element: <Report/> },
      ]
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },

    

    
  ]);

  return routes;
}
