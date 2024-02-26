"use client";
import Link from "next/link";
import { useState } from "react";
import { CiMenuBurger } from "react-icons/ci";
import { Drawer } from "ui";

import { ProfileDropdown } from "@/components/profile-dd";
import ThemeSwitcher from "@/components/theme-switcher";
import { Search } from "@/components/website_v2/search";

// import { ResourceDropdown } from "./resources-dropdown";
import Logo from "/public/logo/logo-full.png";

function Header() {
  const [show, setShow] = useState(false);
  return (
    <header className="z-30 w-full">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between md:h-20">
          <div className="mr-4 shrink-0 flex gap-2">
            <button onClick={() => setShow(true)} className="md:hidden">
              <CiMenuBurger size="20" className="bold" />
            </button>
            <Link className="flex gap-2" href="/" aria-label="Letterpad">
              <img
                className="mx-auto md:max-w-none"
                width={160}
                src={Logo.src}
                alt="Letterpad"
              />
            </Link>
          </div>
          <nav className="flex grow">
            <ul className="flex grow flex-wrap items-center justify-end gap-6">
              <li className="hidden md:block">
                {/* <ResourceDropdown /> */}
                <Link href="/resources">Resources</Link>
              </li>
              {process.env.NEXT_PUBLIC_PAYMENTS_ACTIVE && (
                <li className="hidden md:block">
                  <Link href="/pricing">Pricing</Link>
                </li>
              )}
              <li>
                <Search />
              </li>
              <li className="hidden md:block">
                <ThemeSwitcher />
              </li>
              <li>
                <ProfileDropdown />
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
          <li className="hidden">
            <Link href="/resources">Resources</Link>
          </li>
          {process.env.NEXT_PUBLIC_PAYMENTS_ACTIVE && (
            <li>
              <Link href="/pricing">Pricing</Link>
            </li>
          )}
          <li>
            <ThemeSwitcher />
          </li>
        </ul>
      </Drawer>
    </header>
  );
}

export default Header;
