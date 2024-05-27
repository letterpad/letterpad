'use client';
import { useEffect, useState } from 'react';
import { AuthModal, Button } from 'ui/dist/index.mjs';

export const AuthButtons = () => {
  const [source, setSource] = useState('');
  useEffect(() => {
    const source = typeof window !== 'undefined' ? window.location.href : '';
    setSource(source);
  }, []);

  return (
    <ul className="flex gap-4">
      <li>
        <AuthModal
          TriggerComponent={
            <Button variant={'link'} className="!p-0">
              Login
            </Button>
          }
          source={source}
        />
      </li>
      <li>
        <AuthModal
          TriggerComponent={
            <Button variant={'link'} className="!p-0">
              Register
            </Button>
          }
          source={source}
          view="register"
        />
      </li>
    </ul>
  );
};
