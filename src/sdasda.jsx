import { Navigate, useRoutes } from 'react-router-dom';
import PrivateRoute from './PrivateRoute'; // Adjust the path as needed
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';

import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
//  Forms Section
import Forms from './pages/Form';
    import FormsSRF from './pages/FormsSRF';
    import FormsBIF from './pages/FormsBIF';
    import FormsRIF from './pages/FormsRIF';
    import FormsIRF from './pages/FormsIRF';
//  Profiling Section
import Profiling from './pages/Profiling';
    import ProfilingMR from './pages/ProfilingMR';
    import ProfilingCI from './pages/ProfilingCI';
//  Reports Section
import Reports from './pages/Report';
    import ReportsPTR from './pages/ReportsPTR';
    import ReportsITR from './pages/ReportsITR';
    import ReportsMAR from './pages/ReportsMAR';
    import ReportsILF from './pages/ReportsILF';
//  Archives Section
import Archives from './pages/Archive';
//  Users Section
import UserPage from './pages/UserPage';

// ----------------------------------------------------------------------

const firebaseConfig = {
  apiKey: "AIzaSyDHFEWRU949STT98iEDSYe9Rc-WxcL3fcc",
  authDomain: "wp4-technician-dms.firebaseapp.com",
  projectId: "wp4-technician-dms",
  storageBucket: "wp4-technician-dms.appspot.com",
  messagingSenderId: "1065436189229",
  appId: "1:1065436189229:web:88094d3d71b15a0ab29ea4"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

// ----------------------------------------------------------------------
export default function Router() {

  const {isAuthenticated} = auth();

  const routes = useRoutes([

    {
      path: 'login',
      element: <LoginPage />,
    },
    
    {  
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
        //  Forms Section
        { path: 'form', element: <Forms/>}, 
          { path: 'service_request', element: <FormsSRF/>}, 
          { path: 'borrowers_item', element: <FormsBIF/>},
          { path: 'request_item', element: <FormsRIF/>},
          { path: 'inspection_report', element: <FormsIRF/>},
        //  Profiling Section
        { path: 'profiling', element: <Profiling/> },
          { path: 'profiling_mr', element: <ProfilingMR/> },
          { path: 'profiling_ci', element: <ProfilingCI/> },
        //  Reports Section
        { path: 'reports', element: <Reports/> },
          { path: 'reports_ptr', element: <ReportsPTR/> },
          { path: 'reports_itr', element: <ReportsITR/> },
          { path: 'reports_mar', element: <ReportsMAR/> },
          { path: 'reports_ilf', element: <ReportsILF/> },
        //  Archives Section
        { path: 'archives', element: <Archives/> },
        //  User Section
        { path: 'user', element: <UserPage/> },
      ]
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
