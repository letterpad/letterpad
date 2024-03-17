// export const revalidate = 60;
import { ImageResponse } from 'next/og';

// export const runtime = 'edge';
import { getAuthorAndSettingsData, getPostData } from '@/data';

export default async function AboutOG(props) {
  const post = await getPostData(props.params.slug);
  const data = await getAuthorAndSettingsData();

  if (!data?.settings || !data?.me) return {};

  const { settings } = data;

  const image =
    'https://images.unsplash.com/photo-1550100136-e092101726f4?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

  if (!post || post.author?.__typename !== 'Author') return {};
  return new ImageResponse(
    (
      <div
        tw="flex bg-black text-white w-full h-full flex-row items-center justify-center border"
        style={{
          background: 'linear-gradient(to bottom, #274151, #000)',
          border: '10px solid #ffffff2f',
        }}
      >
        <div tw="w-1/3 bg-gray-200 flex h-full">
          <img
            src={post.cover_image.src ?? image}
            tw="flex w-full h-full"
            style={{ objectFit: 'cover' }}
            alt="Post cover image"
          />
        </div>
        <div
          tw="py-16 w-full flex flex-1 px-8 flex-col h-full justify-between"
          style={{
            fontFamily: "'Noto Sans', sans-serif",
            fontWeight: 700,
          }}
        >
          <div tw={`flex flex-col`}>
            <p>{settings.site_title}</p>
            <h1 tw="text-5xl" style={{ fontWeight: 'bolder' }}>
              {post.title}
            </h1>
          </div>
          <div tw="flex items-center flex-row">
            <img
              alt={post.author.name}
              src={post.author.avatar}
              style={{ objectFit: 'cover' }}
              tw="w-16 h-16 rounded-full object-cover"
            />
            <div tw="flex flex-col ml-4">
              <span tw="text-2xl font-medium">{post.author.name}</span>
              <span tw="text-blue-400 text-xl">{settings.site_url}</span>
            </div>
          </div>
        </div>
      </div>
    )
  );
}
