'use client';

import { createContext, useContext } from 'react';

interface Session {
  user: {
    avatar: string;
    name: string;
    username: string;
  };
}
const Context = createContext<Session | null>(null);

export function SessionProvider({ children, session }: any) {
  return <Context.Provider value={session}>{children}</Context.Provider>;
}

export const useSession = () => {
  const session = useContext(Context);
  return session;
};
