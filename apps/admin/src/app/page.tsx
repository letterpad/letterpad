import { Metadata, Viewport } from "next";

import { getRootUrl } from "@/shared/getRootUrl";

import Header from "../components/header/Header";
import Footer from "../components/website/Footer";
import { Website as WebsiteV2 } from "../components/website_v2";
import { AiAd } from "../components/website_v2/banner/aiAd";

const Home = () => {
  return (
    <>
      <script
        key="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(letterpadStructuredData),
        }}
      />
      <div
        className="flex flex-col justify-between min-h-screen"
        style={{
          background:
            "radial-gradient(ellipse 84% 35% at 50% -25%, rgb(113 153 243 / 70%), transparent)",
        }}
      >
        <AiAd />
        <Header displayBg={false} />
        <div className="md:px-0 flex-1">
          <div className="flex flex-col justify-between">
            <WebsiteV2 />
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Home;

export const viewport: Viewport = {
  themeColor: "black",
  width: "device-width",
};

export const metadata: Metadata = {
  title: "Letterpad - A blog publishing platform",
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
