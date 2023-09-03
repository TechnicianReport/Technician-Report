import { Helmet } from 'react-helmet-async';
import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = getAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // User is now logged in
    } catch (error) {
      console.error("Error signing in: ", error.message);
    }
  };

  // Your login logic will go here

  return (
    <div>
      <h2>Login</h2>
      <form>
        <h1>Email:</h1>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        
        
        <h1>Password:</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
         <button type="submit" onClick={handleLogin}>Login</button>
      </form>
    </div>
  );
}

export default Login;