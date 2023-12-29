export const runtime = 'edge';
export const revalidate = 60;
import { Inter } from 'next/font/google';
import { ImageResponse } from 'next/og';

import formatDate from '@/lib/utils/formatDate';

import { getAuthorAndSettingsData, getPostData } from '@/data';

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export default async function AboutOG(props) {
  const image = 'https://picsum.photos/seed/picsum/1200/627';
  const post = await getPostData(props.params.slug);
  const data = await getAuthorAndSettingsData();

  if (!data?.settings || !data?.me) return {};

  const { settings, me } = data;
  if (!post || post.author?.__typename !== 'Author') return {};
  return new ImageResponse(
    (
      <div tw="flex  h-full w-full bg-white flex-col" style={font('Inter 300')}>
        <img
          style={{ objectFit: 'cover' }}
          tw="absolute inset-0 w-full h-full"
          src={post.cover_image.src ?? image}
          alt="Saha"
        />
        <div tw="bg-black absolute inset-0 bg-opacity-60"></div>
        <main tw="flex grow pt-4 w-full justify-center items-center p-10">
          <div tw="flex flex-col px-10">
            <div tw="flex flex-col  grow text-[28px] h-70 justify-center text-white">
              <div
                tw="text-[14px] pb-10 uppercase text-gray-300"
                style={font('Roboto 900')}
              >
                {formatDate(post.publishedAt)}
              </div>
              <div
                tw="text-[48px] mb-16 font-bolder leading-1"
                style={font('Roboto 900')}
              >
                {post.title}
              </div>
              {/* <div
                tw="flex mb-5 text-[24px] text-gray-300"
                style={font('Roboto 400')}
              >
                {post.excerpt}
              </div> */}
              <div tw="flex uppercase pt-8 text-sm" style={font('Roboto 400')}>
                <span className="flex items-center">
                  <div tw="flex">
                    {me.avatar && (
                      <img
                        tw="rounded-full"
                        alt={
                          post.author?.__typename === 'Author'
                            ? post.author?.name
                            : ''
                        }
                        style={{ objectFit: 'cover' }}
                        // @ts-ignore
                        src={me.avatar}
                        width={40}
                        height={40}
                      />
                    )}
                  </div>
                  <span tw="flex mt-2 ml-2">{post.author.name}</span>
                </span>
              </div>
            </div>
          </div>
        </main>

        <footer
          tw="flex w-full justify-center text-2xl text-gray-300 pb-10"
          style={font('Roboto Mono 400')}
        >
          {settings.site_title}
        </footer>
      </div>
    ),
    {
      width: 800,
      height: 600,
      fonts: [
        {
          name: 'Roboto 900',
          data: (await fetchAndConvertFont(
            'https://fonts.googleapis.com/css2?family=Roboto:wght@900&display=swap'
          )) as ArrayBuffer,
        },
        {
          name: 'Roboto 400',
          data: (await fetchAndConvertFont(
            'https://fonts.googleapis.com/css2?family=Roboto:wght@400&display=swap'
          )) as ArrayBuffer,
        },
      ],
    }
  );
}

// lil helper for more succinct styles
function font(fontFamily: string) {
  return { fontFamily };
}

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
async function fetchAndConvertFont(cssUrl: string) {
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
    return arrayBuffer;
  }
}
