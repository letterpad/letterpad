import { InferGetServerSidePropsType } from 'next';

import SocialIcon from '@/components/social-icons';

import { PageTitle } from './commons/title';
import { getServerSideProps } from '../../pages/about';

export const About = ({
  settings,
  me,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const {
    name,
    avatar = '/static/images/avatar.png',
    bio,
    occupation,
    company_name,
    social,
  } = me;
  const { site_description } = settings;
  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <PageTitle>About</PageTitle>
        </div>
        <div className="items-start space-y-2 xl:grid xl:grid-cols-3 xl:gap-x-8 xl:space-y-0">
          <div className="flex flex-col items-center space-x-2 pt-8">
            {avatar && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatar}
                alt="avatar"
                width="192px"
                height="auto"
                className="h-48 w-48 rounded-full object-cover"
              />
            )}
            <h3 className="pt-4 pb-2 text-2xl font-bold leading-8 tracking-tight">
              {name}
            </h3>
            <div className="text-gray-500 dark:text-gray-300">{occupation}</div>
            <div className="text-gray-500 dark:text-gray-300">
              {company_name}
            </div>
            <div className="flex space-x-3 pt-6">
              <SocialIcon kind="mail" href={`mailto:${settings.site_email}`} />
              <SocialIcon kind="github" href={social?.github} />
              <SocialIcon kind="linkedin" href={social?.linkedin} />
              <SocialIcon kind="twitter" href={social?.twitter} />
            </div>
          </div>
          <div className="prose max-w-none pt-8 pb-8 dark:prose-dark xl:col-span-2">
            <div dangerouslySetInnerHTML={{ __html: site_description ?? '' }} />
            <br />
            <div dangerouslySetInnerHTML={{ __html: bio ?? '' }} />
          </div>
        </div>
      </div>
    </>
  );
};
