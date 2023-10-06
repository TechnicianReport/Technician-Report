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
              {/* Redirect to login if not authenticated */}
              {!isAuthenticated && <Route path="*" element={<Navigate to="/" />} />}

              {/* Define the login route */}
              <Route path="/" element={<LoginPage />} />

              {/* If isAuthenticated is true, render the Router component with its routes */}
              {isAuthenticated && (
                <Route path="/*" element={<Router />} />
              )}
            </Routes>
          </ThemeProvider>
        </BrowserRouter>
      </HelmetProvider>
    </AuthContextProvider>
  );
}