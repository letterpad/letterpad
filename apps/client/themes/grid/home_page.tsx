import {
  MeFragmentFragment,
  PageFragmentFragment,
  SettingsFragmentFragment,
} from 'letterpad-sdk';
import { FC, ReactNode } from 'react';

import Link from '@/components/Link';
import ScrollTop from '@/components/ScrollTop';

import { SectionContainer } from './commons/section';

export interface Props {
  data: PageFragmentFragment;
  children: ReactNode;
  next?: { slug: string; title: string };
  prev?: { slug: string; title: string };
  site_name: string;
  settings: SettingsFragmentFragment;
  me: MeFragmentFragment;
}
export const HomePage: FC<Props> = ({ next, prev, children }) => {
  return (
    <SectionContainer>
      <ScrollTop />
      <article>
        <div
          className="divide-y divide-gray-200 pb-8 dark:divide-gray-700 xl:divide-y-0 "
          style={{ gridTemplateRows: 'auto 1fr' }}
        >
          <div className="divide-y divide-gray-200 dark:divide-gray-700 xl:col-span-3 xl:row-span-2 xl:pb-0">
            <div className="prose max-w-none pb-8 pt-10 dark:prose-dark">
              {children}
            </div>
          </div>
          <footer>
            <div className="flex flex-col text-sm font-medium sm:flex-row sm:justify-between sm:text-base">
              {prev && (
                <div className="pt-4 xl:pt-8">
                  <Link href={`/blog/${prev.slug}`} className="link">
                    &larr; {prev.title}
                  </Link>
                </div>
              )}
              {next && (
                <div className="pt-4 xl:pt-8">
                  <Link href={`/blog/${next.slug}`} className="link">
                    {next.title} &rarr;
                  </Link>
                </div>
              )}
            </div>
          </footer>
        </div>
      </article>
    </SectionContainer>
  );
};
