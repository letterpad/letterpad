export const runtime = 'edge';
export const revalidate = 60;
import { Inter } from 'next/font/google';
import { ImageResponse } from 'next/server';

import { getPostData, getPostsByTag } from '../../../data';

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export default async function AboutOG(props) {
  const image = 'https://picsum.photos/seed/picsum/1200/627';
  const data = await getPostsByTag(props.params.tag);
  if (!data) return {};
  const { posts, settings, me, tagName } = data;
  return new ImageResponse(
    (
      <div tw="flex  h-full w-full bg-white flex-col" style={font('Inter 300')}>
        <img
          style={{ objectFit: 'cover' }}
          tw="absolute inset-0 w-full h-full"
          src={settings?.banner?.src ?? image}
          alt="Saha"
        />
        <div tw="bg-black absolute inset-0 bg-opacity-60"></div>
        <main tw="flex grow pt-4 w-full justify-center items-center p-10">
          <div tw="flex flex-col px-10">
            <div tw="flex flex-col  grow text-[28px] h-70 justify-center text-white">
              <div
                tw="flex text-[58px] font-bolder mb-7 leading-1"
                style={inter.style}
              >
                Posts tagged with #{tagName}
              </div>
              <div
                tw="flex mb-5 flex"
                style={{ fontSize: 24, fontWeight: 700 }}
              >
                {settings?.site_title}
              </div>
              <div
                tw="flex uppercase pt-8 text-sm"
                style={font('Roboto Mono 400')}
              >
                <span className="flex items-center justify-center">
                  <div tw="flex">
                    {data?.me?.avatar && (
                      <img
                        tw="rounded-full"
                        alt={me?.name}
                        style={{ objectFit: 'cover' }}
                        src={data?.me.avatar}
                        width={40}
                        height={40}
                      />
                    )}
                  </div>
                  <span tw="flex ml-4 mt-2">{me?.name}</span>
                </span>
              </div>
            </div>
          </div>
        </main>

        {/* <footer
          tw="flex w-full justify-center text-2xl text-gray-500 p-10"
          style={font('Roboto Mono 400')}
        >
          {me.name}
        </footer> */}
      </div>
    ),
    {
      width: 800,
      height: 600,
      fonts: [
        {
          name: 'PT Sans',
          data: (await fetchAndConvertFont()) as ArrayBuffer,
        },
        // {
        //   name: 'Inter 500',
        //   data: await inter500,
        // },
        // {
        //   name: 'Roboto Mono 400',
        //   data: await robotoMono400,
        // },
      ],
    }
  );
}

// lil helper for more succinct styles
function font(fontFamily: string) {
  return { fontFamily };
}
// Define the Google Fonts CSS URL
const cssUrl =
  'https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap';

// Function to extract the font URL from the Google Fonts CSS
function extractFontUrl(cssText) {
  const matches = cssText.match(/url\((.*?)\)/);
  if (matches && matches.length > 1) {
    return matches[1].replace(/['"]/g, ''); // Remove single or double quotes around the URL
  }
  return null;
}

// Function to convert a font URL to ArrayBuffer
async function fontUrlToArrayBuffer(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch font file');
    }

    const buffer = await response.arrayBuffer();
    return buffer;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching font:', error);
    return null;
  }
}

// Fetch and convert Google Fonts CSS to ArrayBuffer using async/await
async function fetchAndConvertFont() {
  //   try {
  const response = await fetch(cssUrl);
  if (!response.ok) {
    throw new Error('Failed to fetch CSS');
  }
  const cssText = await response.text();

  const fontUrl = extractFontUrl(cssText);
  if (!fontUrl) {
    throw new Error('Font URL not found in CSS');
  }

  const arrayBuffer = await fontUrlToArrayBuffer(fontUrl);
  if (arrayBuffer) {
    // Do something with the ArrayBuffer, e.g., load it as a font
    // Example: const font = new FontFace('YourFontName', arrayBuffer);
    //          document.fonts.add(font);
    return arrayBuffer;
  }
}
