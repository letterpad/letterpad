import { ImageResponse } from 'next/og';

import { getAuthorAndSettingsData } from '@/data';

export default async function AboutOG(props) {
  const image = 'https://picsum.photos/seed/picsum/1200/627';
  const data = await getAuthorAndSettingsData();
  if (!data) return {};
  const { settings, me } = data;
  return new ImageResponse(
    (
      <div tw="flex  h-full w-full bg-white flex-col">
        <img
          style={{ objectFit: 'cover' }}
          tw="absolute inset-0 w-full h-full"
          src={settings?.banner?.src ?? image}
          alt={settings?.site_title!}
        />
        <div tw="bg-black absolute inset-0 bg-opacity-60"></div>
        <main tw="flex grow pt-4 w-full justify-center items-center p-10">
          <div tw="flex flex-col px-10">
            <div tw="flex flex-col  grow text-[28px] h-70 justify-center text-white">
              <div tw="flex text-[58px] font-bolder mb-7 leading-1">
                Posts tagged with #{props.params.tag}
              </div>
              <div
                tw="flex mb-5 flex"
                style={{ fontSize: 24, fontWeight: 700 }}
              >
                {settings?.site_title}
              </div>
              <div tw="flex uppercase pt-8 text-sm">
                <span className="flex items-center justify-center">
                  <div tw="flex">
                    {data?.me?.avatar && (
                      <img
                        tw="rounded-full"
                        alt={me?.name!}
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
      </div>
    ),
    {
      width: 800,
      height: 600,
    }
  );
}
