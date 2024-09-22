import React, { useState } from 'react';
import { useWebAuthn } from '@/hooks/useWebAuthn';

const WebAuthnLogin = () => {
  const [username, setUsername] = useState('');
  const { loginWithWebAuthn, isWebAuthnSupported } = useWebAuthn();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username) {
      alert('Please enter a username');
      return;
    }
    const result = await loginWithWebAuthn(username);
    if (result.success) {
      alert('Login successful');
      // Redirect to dashboard or home page
    } else {
      alert(result.message || 'Login failed');
    }
  };

  return (
    <div>
      <h1>WebAuthn Login</h1>
      {!isWebAuthnSupported && <p>Your browser does not support WebAuthn.</p>}
      <form onSubmit={handleLogin}>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button type="submit">Login with WebAuthn</button>
      </form>
    </div>
  );
};

export default WebAuthnLogin;
