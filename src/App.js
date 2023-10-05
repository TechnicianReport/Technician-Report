import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthContextProvider, useAuthState } from './firebase'; // Replace with the actual path to your AuthContextProvider and useAuthState

// theme
import ThemeProvider from './theme';
// components
import { StyledChart } from './components/chart';
import ScrollToTop from './components/scroll-to-top';

// Your route components
import Router from './routes';
import LoginPage from './pages/LoginPage'
import Page404 from './pages/Page404'; // Import your 404 page component
// ----------------------------------------------------------------------

export default function App() {
  const { isAuthenticated } = useAuthState(); // Get the authentication state

  return (
    <AuthContextProvider>
      <HelmetProvider>
        <BrowserRouter>
          <ThemeProvider>
            <ScrollToTop />
            <StyledChart />
            <Routes>
              {/* Always redirect to login */}
              <Route path="/" element={<LoginPage />} />
              {/* <Route path="*" element={<Page404 />} /> */}
              {/* Define other routes */}
            </Routes>
            {/* Render your protected routes */}
            {isAuthenticated && <Router />}
          </ThemeProvider>
        </BrowserRouter>
      </HelmetProvider>
    </AuthContextProvider>
  );
}
