import classNames from 'classnames';
import Link from 'next/link';
import { FC } from 'react';
import { BiBook } from 'react-icons/bi';

import { Image } from '../image';

interface Props { 
    slug: string;
    publishedAt: string;
    title: string;
    excerpt: string;
    cover_image: { src?: string };
    stats: {
        reading_time?: string;
    }
 }


export const GridCard: FC<Props> = ({ slug, publishedAt, title, excerpt, cover_image, stats }) => {
   
    return (
        <div
        key={slug}
        className="bg-day dark:bg-night group w-full bg-opacity-50 dark:bg-opacity-50"
        >
        <Link
            className="c-card block transform overflow-hidden rounded-lg bg-transparent transition duration-300 group-hover:scale-[1.02]"
            href={slug ?? ''}
        >
            <div className="relative max-h-4 overflow-hidden rounded-lg pb-60">
            <span>
            <Image
                src={cover_image.src?.replace('w=1080', 'w=600')}
                alt={title}
                style={{ objectFit: 'cover' }}
                />
            </span>
            </div>
            <div className="h-44 px-2 py-4 md:px-0">
            <span className="inline-flex w-full items-center justify-between">
                <span className="flex items-center gap-1 text-sm">
                <BiBook />
                {stats?.reading_time} read
                </span>

                <time dateTime={publishedAt} className="text-sm">
                {publishedAt}
                </time>
            </span>

            <h4 className={classNames('mb-2 mt-2 font-bold leading-5')}>
                {title}
            </h4>
            <p className="text-base tracking-tight text-gray-600 dark:text-gray-300 h-40">
                {excerpt}
            </p>
            </div>
        </Link>
        </div>
    );
}