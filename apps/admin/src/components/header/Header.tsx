"use client";
import Link from "next/link";
import { useState } from "react";
import { CiMenuBurger } from "react-icons/ci";
import { Drawer, ThemeSwitcher } from "ui";

import { ProfileDropdown } from "@/components/profile-dd";
import { Search } from "@/components/website_v2/search";

import { isMembershipFeatureActive } from "../../shared/utils";

// @ts-ignore
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
                className="mx-auto md:max-w-none w-28 md:w-36"
                src={Logo.src}
                alt="Letterpad"
              />
            </Link>
          </div>
          <nav className="flex grow">
            <ul className="flex grow flex-wrap items-center justify-end gap-6">
              <li className="hidden md:block">
                <Link href="/resources/monetise">Monetise</Link>
              </li>
              <li className="hidden md:block">
                {/* <ResourceDropdown /> */}
                <Link href="/resources">Resources</Link>
              </li>
              {isMembershipFeatureActive() && (
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
          <li>
            <Link href="/resources/monetise">Monetise</Link>
          </li>
          <li>
            <Link href="/resources">Resources</Link>
          </li>
          {isMembershipFeatureActive() && (
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
