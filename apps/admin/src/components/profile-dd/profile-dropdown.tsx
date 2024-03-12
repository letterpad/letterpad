"use client";
import { animated, useSpring } from "@react-spring/web";
import classNames from "classnames";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { BsEnvelope } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { FiEdit2 } from "react-icons/fi";
import { IoMdPerson } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { LuLogIn, LuLogOut } from "react-icons/lu";
import { TfiNewWindow } from "react-icons/tfi";
import { VscDebugStart } from "react-icons/vsc";

import { useHomeQueryQuery } from "@/__generated__/src/graphql/queries/queries.graphql";

import { MenuItem } from "./menu-item";
import { useOnClickOutside } from "../../hooks/useOnClickOutisde";
import { isAuthor, isSettings } from "../../utils/type-guards";

export const ProfileDropdown = ({
  adminPage = false,
}: {
  adminPage?: boolean;
}) => {
  const { data: session } = useSession();
  const [{ data }, refetchHomeQuery] = useHomeQueryQuery({
    pause: !session?.user?.id,
  });
  const [show, setShow] = useState(false);
  const author = data && isAuthor(data?.me) ? data.me : null;
  const settings = data && isSettings(data?.settings) ? data.settings : null;
  const ref = useRef(null);

  useEffect(() => {
    if (session?.user?.username) {
      refetchHomeQuery();
    }
  }, [session?.user?.username, refetchHomeQuery]);

  const handleClickOutside = () => {
    setShow(false);
  };

  useOnClickOutside(ref, handleClickOutside);

  const style = useSpring({
    transform: show
      ? "translate3D(calc(-100% + 32px),0,0)"
      : "translate3D(calc(-100% + 32px),-10px,0)",
    opacity: show ? 1 : 0,
  });

  return (
    <div className="relative w-max mx-auto">
      <button
        type="button"
        className={classNames(
          "p-1 dark:hover:bg-slate-400/45 hover:bg-slate-200/45 rounded-full h-10 w-10 flex justify-center items-center",
          {
            "p-1": author,
          }
        )}
        onClick={() => setShow(!show)}
      >
        {author?.avatar ? (
          <img
            src={author.avatar?.replace(
              "image/upload",
              "image/upload/c_scale,w_200"
            )}
            loading="lazy"
            alt={author.name}
            className="h-7 w-7 rounded-full shrink-0 object-cover bg-gray-200"
          />
        ) : (
          <IoMdPerson className="h-6 w-6 md:h-6 md:w-6 rounded-full shrink-0 object-cover" />
        )}
      </button>
      <animated.ul
        style={style}
        className="mt-1 w-52 absolute shadow-lg bg-white dark:bg-slate-800 py-2 z-[1000] rounded-lg max-h-96 overflow-auto -ml-2"
        ref={ref}
      >
        {show &&
          (author ? (
            <>
              {adminPage ? (
                <>
                  <MenuItem
                    label="View Site"
                    icon={<TfiNewWindow size={18} />}
                    path={settings?.site_url}
                    target="_blank"
                  />
                </>
              ) : (
                <>
                  <MenuItem
                    label="Posts"
                    icon={<BsEnvelope size={18} />}
                    path="/posts"
                  />
                  <MenuItem
                    label="New Story"
                    icon={<FiEdit2 size={18} />}
                    path="/api/create?type=post"
                  />
                  <MenuItem
                    label="Edit Profile"
                    icon={<CgProfile size={18} />}
                    path="/profile"
                  />
                  <MenuItem
                    label="Settings"
                    icon={<IoSettingsOutline size={18} />}
                    path="/settings"
                  />
                </>
              )}
              <MenuItem
                className="text-red-500 dark:text-red-400"
                label="Logout"
                icon={<LuLogOut size={18} />}
                onClick={(e) => {
                  e.preventDefault();
                  signOut();
                }}
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
                label="Get Started"
                icon={<VscDebugStart size={18} />}
                path="/register"
              />
            </>
          ))}
      </animated.ul>
    </div>
  );
};
