import AOS from "aos";
import { useRouter } from "next/router";
import { useEffect } from "react";

// import { BrowserRouter } from "react-router-dom";
import Client from "../components/website/Client";
import Cta from "../components/website/Cta";
import Features from "../components/website/Features";
import Features02 from "../components/website/Features02";
import Footer from "../components/website/Footer";
import Header from "../components/website/Header";
import Hero from "../components/website/Hero";
import PressLogos from "../components/website/PressLogos";

const NoPage = () => {
  const router = useRouter();
  useEffect(() => {
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
    <div className="flex min-h-screen flex-col overflow-hidden">
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
  );
};

NoPage.isPublic = true;
export default NoPage;
