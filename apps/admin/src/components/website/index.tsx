import { Metadata } from "next";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import Client from "./Client";
import Cta from "./Cta";
import Features from "./Features";
import Features02 from "./Features02";
import Footer from "./Footer";
import Header from "./Header";
import Hero from "./Hero";
import PressLogos from "./PressLogos";

export const metadata: Metadata = {
  title: "Letterpad1 - A platform for content creators",
  description:
    "Discover a world of possibilities for your writing and creativity on Letterpad, the premier blogging platform for creative expression",
  viewport: "width=device-width",
  openGraph: {
    type: "website",
    url: "https://letterpad.app/",
    title: "Letterpad - A free blog publishing platform",
    description:
      "Discover a world of possibilities for your writing and creativity on Letterpad, the premier blogging platform for creative expression",
    siteName: "Letterpad - A free blog publishing platform",
    images: [
      {
        url: "/website/theme-1.png",
        width: 1200,
        height: 630,
        alt: "Letterpad - A free blog publishing platform",
      },
    ],
  },
  twitter: {
    site: "@__abhisaha",
    card: "summary_large_image",
    description:
      "Discover a world of possibilities for your writing and creativity on Letterpad, the premier blogging platform for creative expression",
    title: "Letterpad - A free blog publishing platform",
    images: [
      {
        url: "/website/theme-1.png",
        width: 1200,
        height: 630,
        alt: "Letterpad - A free blog publishing platform",
      },
    ],
    creator: "Abhishek Saha",
  },
};

export const Website = () => {
  const pathname = usePathname();
  useEffect(() => {
    document.body.classList.add("dark");
    document.body.classList.remove("light");
  }, []);

  useEffect(() => {
    const $ = document?.querySelector("html");
    if (!$) return;
    $.style.scrollBehavior = "auto";
    window.scroll({ top: 0 });
    $.style.scrollBehavior = "";
  }, [pathname]); // triggered on route change

  return (
    <>
      <div className="flex min-h-screen flex-col overflow-hidden bg-gray-900 text-gray-100">
        <Header />
        <main className="grow">
          <Hero />
          <Features />
          <Features02 />
          <Client />
          <Cta />
          <PressLogos />
        </main>

        <Footer />
      </div>
    </>
  );
};
