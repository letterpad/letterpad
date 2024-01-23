import Link from 'next/link';
import { getFeed } from '../../data';
import { getReadableDate } from '../../utils';
import { CgCalendar } from 'react-icons/cg';
import { BiCalendar, BiPencil } from 'react-icons/bi';

export const About = async ({ settings, me }) => {
  const {
    name,
    avatar = '/static/images/avatar.png',
    bio,
    occupation,
    createdAt,
  } = me;

  const feed = await getFeed();

  const rows = feed ? feed.feedResponse.rows : [];
  const postCount = rows.filter((row) => row.link.includes('/post/')).length;
  return (
    <div className="mx-auto px-8 lg:px-48">
      <div className="flex items-center mt-16 gap-4">
        <span className="rounded p-1 bg-black dark:bg-white">
          <img src={avatar} alt="avatar" className="w-20 h-20 rounded-full" />
        </span>
        <div className="flex justify-between flex-col">
          <h5 className="block antialiased tracking-normal font-sans font-semibold text-inherit text-3xl">
            {name}
          </h5>
          <span>{occupation}</span>
          <span className="flex gap-2 items-center dark:text-slate-400">
            <BiCalendar />
            Member Since {getReadableDate(Number(createdAt))}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <MetricItem title="Posts" value={postCount} />
      </div>
      <div className="flex gap-8 items-start pb-32 flex-col md:flex-row">
        <p
          className="block antialiased font-sans text-md font-normal leading-relaxed text-inherit mt-8 max-w-2xl"
          dangerouslySetInnerHTML={{ __html: bio }}
        ></p>

        {rows.length && (
          <div className="py-20 md:py-0">
            <h3 className="block antialiased tracking-normal font-sans font-semibold text-inherit text-xl py-4">
              My Feed
            </h3>
            <ol className="relative border-s border-gray-200 dark:border-gray-700">
              {rows.map((row) => {
                return (
                  <li className="mb-10 ms-4">
                    <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                    <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500 flex gap-4">
                      {getReadableDate(new Date(row.pubDate))}{' '}
                      <span className="flex gap-1">
                        <BiPencil />
                        {row.link.includes('/post/') ? 'Article' : 'Page'}
                      </span>
                    </time>
                    <p className="text-base font-normal text-gray-500 dark:text-gray-400"></p>
                    <h3 className="text-md font-semibold text-gray-900 dark:text-white">
                      <Link href={row.link} className="hover:text-blue-500">
                        {row.title}
                      </Link>
                    </h3>
                  </li>
                );
              })}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};

const MetricItem = ({ title, value }) => {
  return (
    <div className="flex items-center gap-2 mt-3">
      <p className="block antialiased text-base leading-relaxed text-inherit  font-bold">
        {value}
      </p>
      <p className="block antialiased text-base leading-relaxed text-inherit font-normal">
        {title}
      </p>
    </div>
  );
};
