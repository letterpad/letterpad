"use client";
import Link from "next/link";

import { EventAction, track } from "@/track";

import Logo from "/public/website/logo.png";
import { ProfileDropdown } from "@/components/profile-dd";
import ThemeSwitcher from "@/components/theme-switcher";

function Header() {
  return (
    <header className="z-30 w-full">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between md:h-20">
          <div className="mr-4 shrink-0 flex gap-2">
            <Link className="block" href="/" aria-label="Letterpad">
              <img
                className="mx-auto md:max-w-none"
                width={40}
                src={Logo.src}
                alt="Letterpad"
              />
            </Link>
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Letterpad
            </span>
          </div>

          <nav className="flex grow">
            <ul className="flex grow flex-wrap items-center justify-end gap-4">
            <li><ThemeSwitcher/></li>
              <li>
                <ProfileDropdown
                  sessionPath="/api/auth/session"
                  renderSign={<SignInNavItems />}
                />
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;

const SignInNavItems = () => {
  return (
    <>
      <li>
        <Link
          className="flex items-center px-3 py-2 font-medium text-gray-400 transition duration-150 ease-in-out hover:text-blue-500 lg:px-5"
          href="/login"
        >
          <span
            onClick={() => {
              track({
                eventAction: EventAction.Click,
                eventCategory: "navbar",
                eventLabel: `login`,
              });
            }}
          >
            Sign in
          </span>
        </Link>
      </li>
      <li className="ml-3">
        <a
          className="btn-sm group w-full bg-gradient-to-t from-blue-600 to-blue-400 text-white shadow-lg hover:to-blue-500"
          href="/register"
          onClick={() => {
            track({
              eventAction: EventAction.Click,
              eventCategory: "navbar",
              eventLabel: `register`,
            });
          }}
        >
          Get Started{" "}
          <span className="ml-1 font-inter tracking-normal text-blue-200 transition-transform duration-150 ease-in-out group-hover:translate-x-0.5">
            -&gt;
          </span>
        </a>
      </li>
    </>
  );
};
