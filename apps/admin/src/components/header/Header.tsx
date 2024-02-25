"use client";
import Link from "next/link";

import { ProfileDropdown } from "@/components/profile-dd";
import ThemeSwitcher from "@/components/theme-switcher";
import { Search } from "@/components/website_v2/search";

import { EventAction, track } from "@/track";

// import { ResourceDropdown } from "./resources-dropdown";
import Logo from "/public/website/logo.png";

function Header() {
  return (
    <header className="z-30 w-full">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between md:h-20">
          <div className="mr-4 shrink-0 flex gap-2">
            <Link className="flex gap-2" href="/" aria-label="Letterpad">
              <img
                className="mx-auto md:max-w-none"
                width={40}
                src={Logo.src}
                alt="Letterpad"
              />
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                Letterpad
              </span>
            </Link>
          </div>

          <nav className="flex grow">
            <ul className="flex grow flex-wrap items-center justify-end gap-6">
              {/* <li>
                <ResourceDropdown />
              </li>
              <li>
                <Link href="/membership">Membership</Link>
              </li> */}
              <li>
                <Search />
              </li>
              <li>
                <ThemeSwitcher />
              </li>
              <li>
                <ProfileDropdown />
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
