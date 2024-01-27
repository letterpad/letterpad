import { Metadata, Viewport } from "next";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import AiSection from "./AiSection";
import Client from "./Client";
import Cta from "./Cta";
import Features from "./Features";
import Features02 from "./Features02";
import Footer from "./Footer";
import Header from "../header/Header";
import Hero from "./Hero";
import PressLogos from "./PressLogos";
import { getRootUrl } from "../../shared/getRootUrl";

export const viewport: Viewport = {
  themeColor: "black",
  width: "device-width",
};

export const metadata: Metadata = {
  title: "Letterpad - Create a beautiful blog.",
  description:
    "Letterpad simplifies blogging, making it easy to start your online writing journey.",
  openGraph: {
    type: "website",
    url: getRootUrl(),
    title: "Letterpad - A blog publishing platform",
    description:
      "Letterpad simplifies blogging, making it easy to start your online writing journey.",
    siteName: "Letterpad - A blog publishing platform",
    images: [
      {
        url: getRootUrl() + "/website/theme-1.png",
        width: 1200,
        height: 630,
        alt: "Letterpad - A blog publishing platform",
      },
    ],
  },
  twitter: {
    site: "@__abhisaha",
    card: "summary_large_image",
    description:
      "Letterpad simplifies blogging, making it easy to start your online writing journey.",
    title: "Letterpad - A blog publishing platform",
    images: [
      {
        url: getRootUrl() + "/website/theme-1.png",
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
      <script
        key="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(letterpadStructuredData),
        }}
      />
      <script
        key="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(letterpadBreadCrumb),
        }}
      />
      <div className="flex min-h-screen flex-col overflow-hidden bg-gray-900 text-gray-100">
        <Header />
        <main className="grow">
          <Hero />
          <Features />
          <AiSection />
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

const letterpadStructuredData = {
  "@context": "http://schema.org",
  "@type": "WebSite",
  name: "Letterpad",
  url: getRootUrl(),
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": getRootUrl(),
  },
  publisher: {
    "@type": "Organization",
    name: "Letterpad",
    logo: {
      "@type": "ImageObject",
      url: getRootUrl() + "/website/logo.png",
    },
  },
  description:
    "Letterpad simplifies blogging, making it easy to start your online writing journey.",
};

const letterpadBreadCrumb = {
  "@context": "http://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: getRootUrl(),
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Register",
      item: getRootUrl() + "/register",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Login",
      item: getRootUrl() + "/login",
    },
    {
      "@type": "ListItem",
      position: 4,
      name: "Documentation",
      item: "https://docs.letterpad.app",
    },
  ],
};
