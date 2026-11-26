'use client';

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Button, Drawer, Modal } from 'ui/dist/index.mjs';

import { startClientSso } from '../lib/utils/clientSso';
import { Subscribe } from '../src/components/subscribe';
interface Session {
  user?: {
    avatar: string;
    name: string;
    username: string;
  };
  showLogin: Dispatch<SetStateAction<boolean>>;
  showSubscribe: Dispatch<SetStateAction<boolean>>;
}
const Context = createContext<Session>({} as Session);

export function SessionProvider({ children }: any) {
  const [show, showLogin] = useState(false);
  const [showSubscribe, setShowSubscribe] = useState(false);
  const [session, setSession] = useState<Session>({
    showLogin,
    showSubscribe: setShowSubscribe,
  });

  useEffect(() => {
    let active = true;
    const refresh = async () => {
      try {
        const response = await fetch('/api/sso/session', { cache: 'no-store' });
        if (!response.ok) return;
        const { user, canCheck } = await response.json();
        if (!active) return;
        setSession({ user, showLogin, showSubscribe: setShowSubscribe });
        if (!user && canCheck) {
          const key = 'letterpad-sso-last-check';
          const now = Date.now();
          // A declined handoff returns to this page. Avoid a redirect loop.
          if (now - Number(sessionStorage.getItem(key)) < 60_000) return;
          sessionStorage.setItem(key, String(now));
          startClientSso(false);
        }
      } catch {
        // Public reading continues if session discovery is unavailable.
      }
    };
    void refresh();
    window.addEventListener('focus', refresh);
    return () => {
      active = false;
      window.removeEventListener('focus', refresh);
    };
  }, []);

  return (
    <Context.Provider value={session}>
      {children}
      <Modal
        show={show}
        toggle={() => showLogin(false)}
        header={
          <span className="font-heading font-bold">You need to Login</span>
        }
        footer={[
          <Button key="back" onClick={() => showLogin(false)} variant="ghost">
            Cancel
          </Button>,
          <Button
            key="submit"
            onClick={() => {
              showLogin(false);
              startClientSso(true);
            }}
          >
            Login
          </Button>,
        ]}
      >
        <div className="text-sm">
          You need to be logged into Letterpad for this action.
        </div>
      </Modal>
      <Drawer
        title="Subscribe"
        onClose={() => setShowSubscribe(false)}
        show={showSubscribe}
        dir="bottom"
        className="w-full h-[60vh]"
      >
        <Subscribe />
      </Drawer>
      {/* <Modal
        toggle={() => setShowSubscribe(false)}
        show={showSubscribe}
        header={`Subscribe`}
        className="bg-white dark:bg-gray-700"
        footer={[]}
      >
        <Subscribe />
      </Modal> */}
    </Context.Provider>
  );
}

export const useSession = () => {
  const session = useContext(Context);
  return session;
};
