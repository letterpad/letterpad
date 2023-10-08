import { SettingsFragmentFragment } from 'letterpad-sdk';
import Script from 'next/script';
import { FC } from 'react';

import { generateGoogleFontsLink } from './fonts';
import { generateGoogleFontsVariables } from './fonts/fontsCssLink';

export const HeadMeta: FC<{ settings: SettingsFragmentFragment }> = ({
  settings,
}) => {
  const { srcs, contents } = getScripts(settings?.scripts ?? '');
  return (
    <head>
      <Script strategy="afterInteractive" src={'/static/prism.js'} async />
      <link
        href={generateGoogleFontsLink([
          settings.design?.primary_font,
          settings.design?.secondary_font,
          'Roboto_Mono',
        ])}
        rel="stylesheet"
      />
      <style>
        {`
          html {
            --brand-accent: ${settings?.design?.brand_color ?? '#d93097'};
            ${generateGoogleFontsVariables([
              settings.design?.primary_font,
              settings.design?.secondary_font,
              'Roboto_Mono',
              'Inter',
            ])}
          }
          `}
      </style>
      {srcs.map((src) => (
        <Script strategy="afterInteractive" src={src} key={src} />
      ))}
      {contents.map((src, idx) => (
        <Script
          key={idx}
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: src,
          }}
        />
      ))}
    </head>
  );
};

function getScripts(str: string) {
  const srcs: string[] = [];
  const contents: string[] = [];
  if (typeof window === 'undefined') return { srcs, contents };
  var doc = document.implementation.createHTMLDocument(); // Sandbox
  doc.body.innerHTML = str; // Parse HTML properly

  const scripts = doc.querySelectorAll('script');
  scripts.forEach((el: HTMLScriptElement) => {
    if (el.src) srcs.push(el.src);
    if (el.textContent) contents.push(el.textContent);
  });

  return { srcs, contents };
}
