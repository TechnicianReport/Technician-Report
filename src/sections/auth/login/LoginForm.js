import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox, appBarClasses, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components

import { initializeApp } from 'firebase/app'; 
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"; 
import Iconify from '../../../components/iconify';

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

export default function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null); // State variable for error message
  
  

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      // Authenticate using Firebase
      await signInWithEmailAndPassword(auth, email, password);
      // If authentication is successful, redirect to the dashboard
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Error signing in: ', error.message);
      // Set the error message in case of authentication failure
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <form onSubmit={handleLogin}>
      <Stack spacing={3}>
        <TextField
          name="email"
          label="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          autoComplete="password"
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="center" sx={{ my: 2 }}>
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="button" // Use type="button" to prevent form submission
        variant="contained"
        onClick={handleLogin}
        loading={isLoading}
        style={{ backgroundColor: '#0073e6', color: 'white' }}
      >
        Login
      </LoadingButton>
      {error && ( // Render the error message if it exists
        <Typography variant="body2" color="error" sx={{ marginTop: 1, backgroundColor: '#f8d7da', color: '#721c24', padding: '8px', borderRadius: '4px', border: '1px solid #f5c6cb' }}>
          {error}
        </Typography>
      )}
    </form>
    </>
  );
}