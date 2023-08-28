import React from 'react';
import { BrowserRouter, Routes, Route, Route as PrivateRoute, Outlet, Link, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import { StyledChart } from './components/chart';
import ScrollToTop from './components/scroll-to-top';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ThemeProvider>
          <ScrollToTop />
          <StyledChart />
          <Routes>
            {/* Use Navigate to redirect */}
            <Route path="/" element={<Navigate to="/dashboard/app" />} />
            {/* Define other routes */}
          </Routes>
          <Router />
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}