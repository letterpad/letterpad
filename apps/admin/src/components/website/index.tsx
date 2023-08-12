import AOS from "aos";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import Client from "./Client";
import Cta from "./Cta";
import Features from "./Features";
import Features02 from "./Features02";
import Footer from "./Footer";
import Header from "./Header";
import Hero from "./Hero";
import PressLogos from "./PressLogos";

export const Website = () => {
  const router = useRouter();
  useEffect(() => {
    document.body.classList.add("dark");
    document.body.classList.remove("light");
  }, []);
  useEffect(() => {
    AOS.init({
      once: true,
      disable: "phone",
      duration: 500,
      easing: "ease-out-cubic",
    });
  });

  useEffect(() => {
    const $ = document?.querySelector("html");
    if (!$) return;
    $.style.scrollBehavior = "auto";
    window.scroll({ top: 0 });
    $.style.scrollBehavior = "";
  }, [router.pathname]); // triggered on route change

  return (
    <>
      <Head>
        <title>Letterpad - A platform for content creators</title>
        <meta name="viewport" content="width=device-width" />
        <meta charSet="utf-8" />
        <meta name="robots" content="follow, index" />
        <meta
          content="Discover a world of possibilities for your writing and creativity on Letterpad, the premier blogging platform for creative expression"
          name="description"
        />
        <meta property="og:url" content="https://letterpad.app/" />
        <link rel="canonical" href="https://letterpad.app/" />
        <meta property="og:type" content="website" />
        <meta
          property="og:site_name"
          content="Letterpad - A free blog publishing platform"
        />
        <meta
          property="og:description"
          content="Discover a world of possibilities for your writing and creativity on Letterpad, the premier blogging platform for creative expression"
        />
        <meta
          property="og:title"
          content="Letterpad - A free blog publishing platform"
        />
        <meta name="image" property="og:image" content="/website/theme-1.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@__abhisaha" />
        <meta
          name="twitter:title"
          content="Letterpad - A free blog publishing platform"
        />
        <meta
          name="twitter:description"
          content="Discover a world of possibilities for your writing and creativity on Letterpad, the premier blogging platform for creative expression"
        />
        <meta name="twitter:image" content="/website/theme-1.png" />
      </Head>
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
