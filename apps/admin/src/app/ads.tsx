"use client";

import Script from "next/script";
import { useRef } from "react";

type AdsWindow = Window & { adsbygoogle?: Record<string, never>[] };

export function Ads({ clientId, slot }: { clientId: string; slot: string }) {
  const requested = useRef(false);
  return (
    <>
      <ins
        className="adsbygoogle block"
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      <Script
        id="letterpad-homepage-ads"
        strategy="lazyOnload"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(clientId)}`}
        crossOrigin="anonymous"
        onReady={() => {
          if (requested.current) return;
          requested.current = true;
          const target = window as AdsWindow;
          (target.adsbygoogle ??= []).push({});
        }}
      />
    </>
  );
}
