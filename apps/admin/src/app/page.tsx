import { Metadata, Viewport } from "next";

import { Homepage } from "@/components/homepage";

import { getRootUrl } from "@/shared/getRootUrl";

export default function Home({
  searchParams,
}: {
  searchParams: { before?: string };
}) {
  const before = searchParams.before;
  const cursor =
    typeof before === "string" && /^[\w-]{1,100}$/.test(before)
      ? before
      : undefined;
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(letterpadStructuredData),
        }}
      />
      <Homepage cursor={cursor} />
    </>
  );
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf9f6" },
    { media: "(prefers-color-scheme: dark)", color: "#1c1b19" },
  ],
  width: "device-width",
};

export const metadata: Metadata = {
  title: "Letterpad — Discover independent writing",
  description:
    "Discover thoughtful stories from independent writers across Letterpad. Explore popular reads, find a topic, and start a blog of your own.",
  openGraph: {
    type: "website",
    url: getRootUrl(),
    title: "Letterpad — Discover independent writing",
    description:
      "Discover thoughtful stories from independent writers across Letterpad. Explore popular reads, find a topic, and start a blog of your own.",
    siteName: "Letterpad — Discover independent writing",
    images: [
      {
        url: getRootUrl() + "/website/theme-1.png",
        width: 1200,
        height: 630,
        alt: "Letterpad — Discover independent writing",
      },
    ],
  },
  twitter: {
    site: "@__abhisaha",
    card: "summary_large_image",
    description:
      "Discover thoughtful stories from independent writers across Letterpad. Explore popular reads, find a topic, and start a blog of your own.",
    title: "Letterpad — Discover independent writing",
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
    "Discover thoughtful stories from independent writers across Letterpad. Explore popular reads, find a topic, and start a blog of your own.",
};
