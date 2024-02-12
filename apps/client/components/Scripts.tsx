import { SettingsFragmentFragment } from 'letterpad-sdk';
import Head from 'next/head';
import Script from 'next/script';
import { FC } from 'react';

import Fonts from './fonts/fonts';

export const HeadMeta: FC<{ settings: SettingsFragmentFragment }> = ({
  settings,
}) => {
  const { srcs, content } = extractScriptInfo(settings?.scripts ?? '');
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preload" as="image" href={settings.banner?.src!} />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin={'anonymous'}
        />

        <Fonts
          fonts={[
            settings.design?.primary_font,
            settings.design?.secondary_font,
            'Roboto_Mono',
          ]}
        />
      </Head>
      <Script strategy="afterInteractive" src={'/static/prism.js'} async />
      {srcs.map((src) => (
        <Script strategy="afterInteractive" src={src} key={src} async />
      ))}
      <Script
        id="script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: content,
        }}
      />
    </>
  );
};

function extractScriptInfo(inputString) {
  const scriptInfo: any = {
    srcs: [],
    content: '',
  };

  // Regular expression to match <script> tags
  const scriptTagRegex = /<script(?:\s[^>]*)?>[\s\S]*?<\/script>/gi;

  // Regular expression to match src attribute in a <script> tag
  const srcAttributeRegex = /src=["']([^"']+)["']/i;

  // Extracting <script> tags from the input string
  const scriptTags = inputString.match(scriptTagRegex);

  if (scriptTags) {
    scriptTags.forEach((scriptTag) => {
      // Extracting src attribute
      const srcMatch = srcAttributeRegex.exec(scriptTag);
      if (srcMatch && srcMatch[1]) {
        scriptInfo.srcs.push(srcMatch[1]);
      }

      // Extracting content between <script> tags
      const content = scriptTag
        .replace(/<script(?:\s[^>]*)?>|<\/script>/gi, '')
        .trim();
      if (content.length > 0) {
        scriptInfo.content = content;
      }
    });
  }

  return scriptInfo;
}
