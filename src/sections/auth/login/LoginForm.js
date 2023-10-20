import { useState, useEffect } from 'react'; // Import useEffect
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Link,
  Stack,
  IconButton,
  InputAdornment,
  TextField,
  Checkbox,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { initializeApp} from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
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
  const location = useLocation(); // Access the location object
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null); // State variable for error message
  
  const [authenticated, setAuthenticated] = useState(false); // Define setAuthenticated

  
  // useEffect(() => {
  //   // Check if the user is already authenticated, then navigate to the dashboard
  //   const unsubscribe = auth.onAuthStateChanged((user) => {
  //     if (user) {
  //       navigate('/dashboard', { replace: true });
  //     }
  //   });
  //   return () => unsubscribe();
  // }, [navigate]);


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setAuthenticated(!!user);
      setIsLoading(false);

      if (!!user) {
        const prevPath = location.state?.from || '/dashboard'; // Get the previous path from location state
        navigate(prevPath);
        localStorage.setItem('authenticated', 'true');
      }
    });

    const isUserAuthenticated = localStorage.getItem('authenticated') === 'true';
    setAuthenticated(isUserAuthenticated);

    return () => unsubscribe();
  }, [navigate, location]);

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

//   auth.onAuthStateChanged(() => {
//   // The Auth service is now fully initialized

//   // Set session persistence for Firebase Authentication
//   auth.setPersistence(auth.Auth.Persistence.SESSION)
//     .then(() => {
//       // The session persistence is set.
//     })
//     .catch((error) => {
//       console.error('Error setting session persistence:', error);
//     });
// });

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