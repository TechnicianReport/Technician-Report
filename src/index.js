import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot
import App from './App';
import { AuthContextProvider } from './firebase';

const root = document.getElementById('root');

const appRoot = createRoot(root); // Create a root

appRoot.render(
  <React.StrictMode>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </React.StrictMode>
);