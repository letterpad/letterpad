import { SettingsFragmentFragment } from 'letterpad-sdk';
import Script from 'next/script';
import { FC } from 'react';

// import { generateGoogleFontsLink } from './fonts';
import { generateGoogleFontsVariables } from './fonts/fontsCssLink';
import Fonts from './fonts/fonts';

export const HeadMeta: FC<{ settings: SettingsFragmentFragment }> = ({
  settings,
}) => {
  console.log(settings.scripts);
  const { srcs, content } = extractScriptInfo(settings?.scripts ?? '');
  return (
    <head>
      <Script strategy="afterInteractive" src={'/static/prism.js'} async />
      <style>
        {`
          html {
            --accent: ${settings?.design?.brand_color ?? '#d93097'};
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
        <Script strategy="afterInteractive" src={src} key={src} async />
      ))}
      <Script
        id="script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: content,
        }}
      />
      {/* <link
        href={generateGoogleFontsLink([
          settings.design?.primary_font,
          settings.design?.secondary_font,
          'Roboto_Mono',
        ])}
        rel="stylesheet"
      /> */}
      <Fonts
        fonts={[
          settings.design?.primary_font,
          settings.design?.secondary_font,
          'Roboto_Mono',
        ]}
      />
    </head>
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
