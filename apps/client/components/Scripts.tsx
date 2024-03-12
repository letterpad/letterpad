import { SettingsFragmentFragment } from 'letterpad-sdk';
import Script from 'next/script';
import { FC } from 'react';

export const HeadMeta: FC<{ settings: SettingsFragmentFragment }> = ({
  settings,
}) => {
  const { srcs, content, metatags } = extractScriptInfo(
    settings?.scripts ?? ''
  );
  return (
    <>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preload" as="image" href={settings.banner?.src!} />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin={'anonymous'}
        />
        {metatags.map((meta) => (
          <meta name={meta.name} content={meta.content} key={meta.name} />
        ))}
      </head>
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
  const scriptInfo = {
    srcs: [] as string[],
    content: '',
    metatags: [] as { name: string; content: string }[],
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

  // Regular expression to match <meta> tags
  const metaTagRegex = /<meta(?:\s[^>]*)?>/gi;

  // Regular expression to match name and content attributes in a <meta> tag
  const nameContentAttributeRegex =
    /name=["']([^"']+)["']\s+content=["']([^"']+)["']/i;

  // Extracting <meta> tags from the input string
  const metaTags = inputString.match(metaTagRegex);

  if (metaTags) {
    metaTags.forEach((metaTag: string) => {
      const nameContentMatch = nameContentAttributeRegex.exec(metaTag);
      if (nameContentMatch && nameContentMatch[1] && nameContentMatch[2]) {
        scriptInfo.metatags.push({
          name: nameContentMatch[1],
          content: nameContentMatch[2],
        });
      }
    });
  }

  return scriptInfo;
}
