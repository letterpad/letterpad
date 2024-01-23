'use client';
import { useState, useEffect, useRef } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { LuLogOut, LuLogIn } from 'react-icons/lu';
import { CgProfile } from 'react-icons/cg';
import { FiEdit2 } from 'react-icons/fi';
import { IoSettingsOutline } from 'react-icons/io5';
import { useOnClickOutside } from '@/hooks/useOnClickOutisde';
import { RxAvatar } from 'react-icons/rx';
import classNames from 'classnames';

interface Session {
  name: string;
  avatar: string;
}

export const ProfileDropdown = () => {
  const [show, setShow] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const ref = useRef(null);

  const handleClickOutside = () => {
    setShow(false);
  };

  useOnClickOutside(ref, handleClickOutside);

  const style = useSpring({
    transform: show ? 'translate3D(0,0,0)' : 'translate3D(0,-10px,0)',
    opacity: show ? 1 : 0,
  });

  useEffect(() => {
    fetch(`/api/client/session`, {
      headers: {
        siteurl: document.location.origin,
      },
    })
      .then((res) => res.json())
      .then(setSession);
  }, []);

  return (
    <div className="relative w-max mx-auto">
      <button
        type="button"
        className={classNames(
          'flex items-center rounded-full text-[#333] text-sm font-semibold border-2 dark:border-gray-800 border-gray-300 outline-none bg-gray-100 dark:bg-slate-800 dark:text-gray-200',
          {
            'p-1': session,
          }
        )}
        onClick={() => setShow(!show)}
        ref={ref}
      >
        {session?.avatar ? (
          <img
            src={session.avatar}
            className="w-6 h-6 rounded-full shrink-0 object-cover"
          ></img>
        ) : (
          <RxAvatar size={28} />
        )}
      </button>
      <animated.ul
        style={style}
        className="mt-1 absolute shadow-lg bg-white dark:bg-slate-800 py-2 z-[1000] w-max rounded-lg max-h-96 overflow-auto"
      >
        {show &&
          (session ? (
            <>
              <MenuItem label="New Story" icon={<FiEdit2 size={18} />} />
              <MenuItem label="Edit Profile" icon={<CgProfile size={18} />} />
              <MenuItem
                label="Settings"
                icon={<IoSettingsOutline size={18} />}
              />
              <MenuItem label="Logout" icon={<LuLogOut size={18} />} />
            </>
          ) : (
            <>
              <MenuItem label="SignIn" icon={<LuLogIn size={18} />} />
              <MenuItem
                label="Start Publishing"
                icon={<CgProfile size={18} />}
              />
            </>
          ))}
      </animated.ul>
    </div>
  );
};

const MenuItem = ({ label, icon }) => {
  return (
    <li className="py-2.5 px-6 flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-100 text-sm cursor-pointer gap-2">
      <span>{icon}</span>
      <span>{label}</span>
    </li>
  );
};
