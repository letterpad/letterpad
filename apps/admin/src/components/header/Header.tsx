"use client";
import classNames from "classnames";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { CiMenuBurger } from "react-icons/ci";
import { Drawer, ThemeSwitcher } from "ui";

import { ProfileDropdown } from "@/components/profile-dd";
import { Search } from "@/components/website_v2/search";

// @ts-ignore
import Logo from "/public/logo/logo-full.png";

const source = typeof window !== "undefined" ? window.location.href : "";

const menu = (isLoggedIn: boolean) => [
  {
    link: "/resources/monetise",
    title: "Monetise",
    className: "hidden md:block",
    visible: true,
  },
  {
    link: "/resources",
    title: "Resources",
    className: "hidden md:block",
    visible: true,
  },
  {
    link: "/pricing",
    title: "Pricing",
    className: "hidden md:block",
    visible: true,
  },
  {
    link: "/features",
    title: "Features",
    className: "hidden md:block",
    visible: true,
  },
];

const authItems = (isLoggedIn) => [
  {
    link: `/api/identity/login?source=${source}`,
    title: "Login",
    className: "hidden md:block",
    visible: !isLoggedIn,
  },
];

function Header({ displayBg = true }: { displayBg?: boolean }) {
  const [show, setShow] = useState(false);
  const { data } = useSession();
  const isLoggedIn = !!data?.user?.id;
  return (
    <header
      className={classNames("z-30 w-full", {
        "bg-slate-950 text-white": displayBg,
      })}
      data-aos="fade-in"
      data-aos-easing="linear"
      data-aos-duration="200"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between md:h-20">
          <div className="mr-4 shrink-0 flex gap-2">
            <button onClick={() => setShow(true)} className="md:hidden">
              <CiMenuBurger size="20" className="bold" />
            </button>
            <Link className="flex gap-2" href="/" aria-label="Letterpad">
              <img
                className="mx-auto md:max-w-none w-28 md:w-36"
                src={Logo.src}
                alt="Letterpad"
              />
            </Link>
          </div>
          <nav className="flex grow">
            <ul className="flex grow flex-wrap items-center justify-end gap-6">
              <li className="hidden md:block">
                <Search />
              </li>
              {menu(isLoggedIn)
                .filter((item) => item.visible)
                .map((item) => (
                  <li className={item.className} key={item.title}>
                    <Link href={item.link}>{item.title}</Link>
                  </li>
                ))}
              {authItems(isLoggedIn)
                .filter((item) => item.visible)
                .map((item) => (
                  <li className={item.className} key={item.title}>
                    <Link href={item.link}>{item.title}</Link>
                  </li>
                ))}
              {isLoggedIn ? (
                <li>
                  <ProfileDropdown />
                </li>
              ) : (
                <Link
                  href="/register"
                  className="rounded-full border px-3 py-1.5 bg-black text-white text-sm"
                >
                  Get Started
                </Link>
              )}{" "}
              <li>
                <ThemeSwitcher />
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <Drawer
        show={show}
        onClose={() => setShow(false)}
        dir="left"
        title=""
        className="w-64"
      >
        <ul className="flex flex-col grow flex-wrap justify-end items-center gap-4 text-md mt-10">
          {menu(isLoggedIn)
            .filter((item) => item.visible)
            .map((item) => (
              <li key={item.title}>
                <Link href={item.link}>{item.title}</Link>
              </li>
            ))}
        </ul>
      </Drawer>
    </header>
  );
}

export default Header;
