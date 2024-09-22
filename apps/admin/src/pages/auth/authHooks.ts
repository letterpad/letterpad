import { useCallback, useState } from 'react';
import { useAuth } from './authContext';

// Hook to initiate WebAuthn registration process
export const useWebAuthnRegister = () => {
  const { dispatch } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const startRegistration = useCallback(async () => {
    try {
      // Placeholder for starting WebAuthn registration process
      // This should interact with the backend to start the registration process
      // and update the auth state accordingly
      dispatch({ type: 'WEB_AUTHN_REGISTRATION_REQUEST' });
      // Simulate successful registration for demonstration
      setTimeout(() => {
        dispatch({ type: 'WEB_AUTHN_REGISTRATION_SUCCESS', payload: { user: { id: 'user-id' } } });
      }, 1000);
    } catch (err) {
      setError('Registration failed');
      dispatch({ type: 'WEB_AUTHN_REGISTRATION_FAILURE', payload: { error: err } });
    }
  }, [dispatch]);

  return { startRegistration, error };
};

// Hook to initiate WebAuthn login process
export const useWebAuthnLogin = () => {
  const { dispatch } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const startLogin = useCallback(async () => {
    try {
      // Placeholder for starting WebAuthn login process
      // This should interact with the backend to start the login process
      // and update the auth state accordingly
      dispatch({ type: 'WEB_AUTHN_LOGIN_REQUEST' });
      // Simulate successful login for demonstration
      setTimeout(() => {
        dispatch({ type: 'WEB_AUTHN_LOGIN_SUCCESS', payload: { user: { id: 'user-id' } } });
      }, 1000);
    } catch (err) {
      setError('Login failed');
      dispatch({ type: 'WEB_AUTHN_LOGIN_FAILURE', payload: { error: err } });
    }
  }, [dispatch]);

  return { startLogin, error };
};
