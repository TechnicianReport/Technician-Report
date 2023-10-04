// Import your page components here

import React from 'react';
import { Navigate, useRoutes } from 'react-router-dom';

// Your page components should be imported here
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
import { useAuth } from './sections/auth/login/AuthContent';
import PrivateRoute from './PrivateRoute';
import BlogPage from './pages/BlogPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import Forms from './pages/Form';
import FormsSRF from './pages/FormsSRF';
import FormsBIF from './pages/FormsBIF';
import FormsRIF from './pages/FormsRIF';
import FormsIRF from './pages/FormsIRF';
import Profiling from './pages/Profiling';
import ProfilingMR from './pages/ProfilingMR';
import ProfilingCI from './pages/ProfilingCI';
import Reports from './pages/Report';
import ReportsPTR from './pages/ReportsPTR';
import ReportsITR from './pages/ReportsITR';
import ReportsMAR from './pages/ReportsMAR';
import ReportsILF from './pages/ReportsILF';
import Archives from './pages/Archive';
import UserPage from './pages/UserPage';

export default function Router() {
  const { authenticated } = useAuth();

  const routes = useRoutes([
    {
      path: '/login',
      element: !authenticated ? <LoginPage /> : <Navigate to="/dashboard/app" />,
    },
    {
      path: '/',
      element: !authenticated ? <LoginPage /> : <Navigate to="/dashboard/app" />,
    },
    {
      path: '/dashboard',
      element: authenticated ? <DashboardLayout /> : null, // Remove the <Navigate to="/dashboard/app" /> here
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        <PrivateRoute key="products" path="products" authenticated={authenticated} redirectTo="/login" element={<ProductsPage />} />,
        <PrivateRoute key="blog" path="blog" authenticated={authenticated} redirectTo="/login" element={<BlogPage />} />,
        <PrivateRoute key="forms" authenticated={authenticated} redirectTo="/login" element={<Forms />} />,
        <PrivateRoute key="srf" path="service_request" authenticated={authenticated} redirectTo="/login" element={<FormsSRF />} />,
        <PrivateRoute key="bif" path="borrowers_item" authenticated={authenticated} redirectTo="/login" element={<FormsBIF />} />,
        <PrivateRoute key="rif" path="request_item" authenticated={authenticated} redirectTo="/login" element={<FormsRIF />} />,
        <PrivateRoute key="irf" path="inspection_report" authenticated={authenticated} redirectTo="/login" element={<FormsIRF />} />,
        <PrivateRoute key="profiling" path="profiling" authenticated={authenticated} redirectTo="/login" element={<Profiling />} />,
        <PrivateRoute key="mr" path="profiling_mr" authenticated={authenticated} redirectTo="/login" element={<ProfilingMR />} />,
        <PrivateRoute key="ci" path="profiling_ci" authenticated={authenticated} redirectTo="/login" element={<ProfilingCI />} />,
        <PrivateRoute key="reports" path="reports" authenticated={authenticated} redirectTo="/login" element={<Reports />} />,
        <PrivateRoute key="ptr" path="reports_ptr" authenticated={authenticated} redirectTo="/login" element={<ReportsPTR />} />,
        <PrivateRoute key="itr" path="reports_itr" authenticated={authenticated} redirectTo="/login" element={<ReportsITR />} />,
        <PrivateRoute key="mar" path="reports_mar" authenticated={authenticated} redirectTo="/login" element={<ReportsMAR />} />,
        <PrivateRoute key="ilf" path="reports_ilf" authenticated={authenticated} redirectTo="/login" element={<ReportsILF />} />,
        <PrivateRoute key="archives" path="archives" authenticated={authenticated} redirectTo="/login" element={<Archives />} />,
        <PrivateRoute key="user" path="user" authenticated={authenticated} redirectTo="/login" element={<UserPage />} />,
      ],
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