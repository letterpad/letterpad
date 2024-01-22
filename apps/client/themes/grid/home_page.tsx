import { FC } from 'react';

import Link from '@/components/Link';
import ScrollTop from '@/components/ScrollTop';

import { SectionContainer } from './commons/section';
import { HomePageProps } from '../../types/pageTypes';

export const HomePage: FC<HomePageProps> = ({ children }) => {
  return (
    <SectionContainer>
      <ScrollTop />
      <article>
        <div
          className="divide-y divide-gray-200 pb-8 dark:divide-gray-700 xl:divide-y-0 "
          style={{ gridTemplateRows: 'auto 1fr' }}
        >
          <div className="divide-y divide-gray-200 dark:divide-gray-700 xl:col-span-3 xl:row-span-2 xl:pb-0">
            <div className="mx-auto md:max-w-2xl prose max-w-none pb-8 pt-10 dark:prose-dark">
              {children}
            </div>
          </div>
          <footer>
            <div className="flex flex-col text-sm font-medium sm:flex-row sm:justify-between sm:text-base"></div>
          </footer>
        </div>
      </article>
    </SectionContainer>
  );
};
