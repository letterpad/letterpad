'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface Session {
  user: {
    avatar: string;
    name: string;
    username: string;
  };
}
const Context = createContext<Session | null>(null);

export function SessionProvider({ children }: any) {
  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    fetch(`/redirect-api/client/session`, {
      headers: {
        siteurl: window.location.origin,
      },
    })
      .then((res) => res.json())
      .then((data) => setSession(data));
  }, []);
  return <Context.Provider value={session}>{children}</Context.Provider>;
}

export const useSession = () => {
  const session = useContext(Context);
  return session;
};
