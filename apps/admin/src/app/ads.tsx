"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

export const Ads = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  return (
    <>
      {process.env.NEXT_PUBLIC_LETTERPAD_PLATFORM && (
        <Script
          id="gscript-ads"
          strategy="lazyOnload" // CANNOT Omit!!!
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8634830579255969"
          crossOrigin="anonymous"
        />
      )}
      <ins
        className="adsbygoogle block"
        data-ad-client="ca-pub-8634830579255969"
        data-ad-slot="3222387411"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
      <script
        dangerouslySetInnerHTML={{
          __html: `(adsbygoogle = window.adsbygoogle || []).push({})`,
        }}
      />
    </>
  );
};
