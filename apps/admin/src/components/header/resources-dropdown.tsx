"use client";
import { animated, useSpring } from "@react-spring/web";
import classNames from "classnames";
import Link from "next/link";
import { useRef, useState } from "react";
import { GiCoins } from "react-icons/gi";
import { GoChevronDown, GoChevronUp, GoRocket } from "react-icons/go";
import { VscWorkspaceTrusted } from "react-icons/vsc";

import { useOnClickOutside } from "../../hooks/useOnClickOutisde";

export const ResourceDropdown = () => {
  const [show, setShow] = useState(false);
  const ref = useRef(null);

  const handleClickOutside = () => {
    setTimeout(() => {
      setShow(false);
    }, 0);
  };

  useOnClickOutside(ref, handleClickOutside, "mouseup");

  const style = useSpring({
    transform: show
      ? "translate3D(calc(-50%),0,0)"
      : "translate3D(calc(-50%),-10px,0)",
    opacity: show ? 1 : 0,
    zIndex: show ? 1000 : -1,
  });

  return (
    <div className="relative w-max mx-auto">
      <button
        type="button"
        className={classNames("p-1 flex justify-center items-center gap-2")}
        ref={ref}
        onClick={() => setShow(!show)}
      >
        <span>Resources</span>{" "}
        <span className="text-[0.7rem]">
          {show ? <GoChevronDown /> : <GoChevronUp />}
        </span>
      </button>
      <animated.ul
        style={style}
        className="left-1/2 mt-1 absolute shadow-lg bg-gray-50 dark:bg-slate-800 py-2 rounded-lg px-2 w-screen max-w-2xl sm:px-0"
      >
        {show ? (
          <div className="relative grid grid-cols-2 gap-6 px-5 py-6 sm:gap-7 sm:p-8">
            {items.map(({ link, title, description, icon }) => (
              <Link
                key={link}
                href={link}
                className="-m-4 p-4 flex flex-col justify-between rounded-lg dark:hover:bg-slate-700/30 hover:bg-slate-200/40"
              >
                <div className="ml-4 md:flex-1 md:flex md:flex-col md:justify-between gap-y-1 lg:ml-0">
                  <div className="flex items-start gap-x-2.5">
                    <span className="h-5 w-5 text-blue-500 shrink-0 mt-1">
                      {icon}
                    </span>
                    <div>
                      <p className="text-md font-bold tracking-[-.01em] text-gray-900 dark:text-gray-200">
                        {title}
                      </p>
                      <p className="mt-1 text-sm dark:text-gray-400 text-gray-500">
                        {description}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : null}
      </animated.ul>
    </div>
  );
};
const items = [
  {
    title: "About",
    description: "The story of Letterpad. Understand our mission and vision.",
    link: "/resource/about",
    icon: <GoRocket />,
  },
  {
    title: "Monetise",
    description:
      "Learn how we evaluate and monetise your content. Understand how to make money from your writing.",
    link: "/resource/how-monetisation-works",
    icon: <GiCoins />,
  },
  {
    title: "Writers",
    description:
      "Learn what it takes to be a successful writer. Get tips on writing, publishing, and growing your audience.",
    link: "/resource/effective-writing",
    icon: <VscWorkspaceTrusted />,
  },
];
