import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { AuthContextProvider } from './firebase'; // Import the AuthContextProvider

ReactDOM.render(
  <React.StrictMode>
    <AuthContextProvider> {/* Wrap your App component with AuthContextProvider */}
      <App />
    </AuthContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
