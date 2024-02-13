import { Metadata, Viewport } from "next";

// import { cookies } from "next/headers";
// import { Website } from "../components/website";
import { Website as WebsiteV2 } from "../components/website_v2";
import { getRootUrl } from "../shared/getRootUrl";

const Home = () => {
  // const isNewHome = !!cookies().get("homev2")?.value;
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
      <WebsiteV2 />
    </>
  );
};

export default Home;

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
