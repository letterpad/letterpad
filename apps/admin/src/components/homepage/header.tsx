"use client";

import { IoMoonOutline } from "@react-icons/all-files/io5/IoMoonOutline";
import { IoSunnyOutline } from "@react-icons/all-files/io5/IoSunnyOutline";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useTheme } from "ui/dist/index.mjs";

import { ProfileDropdown } from "@/components/profile-dd";
import { Search } from "@/components/website_v2/search";

export function HomepageHeader({
  section,
}: {
  section: "discover" | "topics" | "topic";
}) {
  const { data } = useSession();
  const { theme, toggleTheme } = useTheme();
  const dark = theme === "dark";

  return (
    <header className="editorial-header">
      <div className="editorial-frame editorial-header-inner">
        <Link href="/" className="editorial-wordmark">
          Letterpad
        </Link>
        <nav className="editorial-nav" aria-label="Primary navigation">
          <Link
            href="/"
            aria-current={section === "discover" ? "page" : undefined}
          >
            Discover
          </Link>
          <Link
            href="/topics"
            aria-current={
              section === "topics"
                ? "page"
                : section === "topic"
                  ? "location"
                  : undefined
            }
          >
            Topics
          </Link>
          <Link href="/features">For writers</Link>
          {!data?.user?.id && (
            <Link className="editorial-mobile-login" href="/login">
              Log in
            </Link>
          )}
        </nav>
        <div className="editorial-actions">
          <Search showLabel />
          {data?.user?.id ? (
            <ProfileDropdown />
          ) : (
            <>
              <Link className="editorial-login" href="/login">
                Log in
              </Link>
              <Link className="editorial-start" href="/register">
                Start writing
              </Link>
            </>
          )}
          <button
            className="editorial-theme"
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${dark ? "light" : "dark"} theme`}
          >
            {dark ? <IoSunnyOutline size={20} /> : <IoMoonOutline size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}
