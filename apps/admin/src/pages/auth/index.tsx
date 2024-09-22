import React from 'react';
import Link from 'next/link';

const AuthIndexPage = () => {
  return (
    <div>
      <h1>Authentication Options</h1>
      <ul>
        <li>
          <Link href="/auth/login">Login</Link>
        </li>
        <li>
          <Link href="/auth/register">Register</Link>
        </li>
        <li>
          <Link href="/auth/webauthnLogin">Login with WebAuthn</Link>
        </li>
        <li>
          <Link href="/auth/webauthnRegister">Register with WebAuthn</Link>
        </li>
      </ul>
    </div>
  );
};

export default AuthIndexPage;
