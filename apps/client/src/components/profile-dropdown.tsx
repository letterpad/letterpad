'use client';
import { animated, useSpring } from '@react-spring/web';
import classNames from 'classnames';
import { useRef, useState } from 'react';
import { CgProfile } from 'react-icons/cg';
import { FiEdit2 } from 'react-icons/fi';
import { IoMdPerson } from 'react-icons/io';
import { IoSettingsOutline } from 'react-icons/io5';
import { LuLogIn, LuLogOut } from 'react-icons/lu';

import { useOnClickOutside } from '@/hooks/useOnClickOutisde';

import { useSession } from '../../context/SessionProvider';
import { getApiRootUrl } from '../../lib/utils/url';

export const ProfileDropdown = () => {
  const [show, setShow] = useState(false);
  const session = useSession();
  const ref = useRef(null);

  const handleClickOutside = () => {
    setShow(false);
  };

  useOnClickOutside(ref, handleClickOutside);

  const style = useSpring({
    transform: show ? 'translate3D(0,0,0)' : 'translate3D(0,-10px,0)',
    opacity: show ? 1 : 0,
  });

  return (
    <div className="relative w-max mx-auto">
      <button
        type="button"
        className={classNames(
          'p-1 dark:hover:bg-slate-400/45 hover:bg-slate-200/45 rounded-full h-10 w-10 flex justify-center items-center',
          {
            'p-1': session,
          }
        )}
        onClick={() => setShow(!show)}
      >
        {session?.user.avatar ? (
          <img
            src={session.user.avatar}
            alt={session.user.name}
            className="h-6 w-6 rounded-full shrink-0 object-cover bg-white p-1"
          />
        ) : (
          <IoMdPerson className="h-6 w-6 md:h-6 md:w-6 rounded-full shrink-0 object-cover" />
        )}
      </button>
      <animated.ul
        style={style}
        className="mt-1 w-52 absolute shadow-lg bg-white dark:bg-slate-800 py-2 z-[1000] rounded-lg max-h-96 overflow-auto -ml-48 md:-ml-20"
        ref={ref}
      >
        {show &&
          (session ? (
            <>
              <MenuItem
                target="_blank"
                label="New Story"
                icon={<FiEdit2 size={18} />}
                path="/api/create?type=post"
              />
              <MenuItem
                target="_blank"
                label="Edit Profile"
                icon={<CgProfile size={18} />}
                path="/profile"
              />
              <MenuItem
                target="_blank"
                label="Settings"
                icon={<IoSettingsOutline size={18} />}
                path="/settings"
              />
              <MenuItem
                label="Logout"
                icon={<LuLogOut size={18} />}
                path={`/api/identity/logout?source=${document.location.href}`}
              />
            </>
          ) : (
            <>
              <MenuItem
                label="SignIn"
                icon={<LuLogIn size={18} />}
                path={`/api/identity/login?source=${document.location.href}`}
              />
              <MenuItem
                label="Start Publishing"
                icon={<IoMdPerson size={18} />}
                path="/register"
              />
            </>
          ))}
      </animated.ul>
    </div>
  );
};

const MenuItem = ({ label, icon, path, target = '' }) => {
  const link = getApiRootUrl() + path;
  return (
    <li className="py-2.5 px-6  hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-100 text-sm cursor-pointer ">
      <a className="flex items-center gap-2" href={link} target={target}>
        <span>{icon}</span>
        <span>{label}</span>
      </a>
    </li>
  );
};
