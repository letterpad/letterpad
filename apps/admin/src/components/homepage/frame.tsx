import localFont from "next/font/local";
import Link from "next/link";
import { ReactNode } from "react";

import "./homepage.css";

import { HomepageHeader } from "./header";

const literata = localFont({
  src: "../../../../../packages/config/fonts/literata.woff2",
  weight: "200 900",
  display: "swap",
  variable: "--editorial-serif",
  fallback: ["Georgia", "serif"],
  adjustFontFallback: false,
});

const geist = localFont({
  src: "../../../../../packages/config/fonts/geist.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--editorial-sans",
  fallback: ["system-ui", "sans-serif"],
  adjustFontFallback: false,
});

export function EditorialFrame({
  section,
  children,
}: {
  section: "discover" | "topics" | "topic";
  children: ReactNode;
}) {
  return (
    <div className={`editorial-home ${literata.variable} ${geist.variable}`}>
      <HomepageHeader section={section} />
      <main className="editorial-frame">{children}</main>
      <footer className="editorial-footer">
        <div className="editorial-frame">
          <Link href="/terms">Terms</Link>
          <Link href="/privacy">Privacy</Link>
          <a href="https://github.com/letterpad/letterpad">Contribute</a>
        </div>
      </footer>
    </div>
  );
}

export function EditorialIntro({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="editorial-intro">
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
}
