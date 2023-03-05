import { Letterpad } from 'letterpad-sdk';
import { InferGetServerSidePropsType } from 'next';

import PageTitle from '@/components/PageTitle';
import SectionContainer from '@/components/SectionContainer';
import { TagSEO } from '@/components/SEO';

import ListLayout from '@/layouts/ListLayout';

import { getServerSideProps } from '../../pages/tag/[tag]';
export const Tag = ({
  posts,
  me: _me,
  tagName,
  settings: _settings,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <SectionContainer>
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <PageTitle>{tagName}</PageTitle>
        </div>
      </SectionContainer>
      <ListLayout posts={posts} />
    </>
  );
};
