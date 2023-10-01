import SocialIcon from '@/components/social-icons';

import { SectionContainer } from './commons/section';
import { PageTitle } from './commons/title';
import { AboutProps } from '../../types/pageTypes';

export const About = ({ settings, me }: AboutProps) => {
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
    <SectionContainer className="mb-20">
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="mx-auto max-w-5xl space-y-2 px-4 pb-8 pt-6 md:space-y-5 md:px-20">
          <PageTitle>About</PageTitle>
        </div>
        <div className="mx-auto max-w-5xl items-start space-y-2 px-4 xl:grid xl:grid-cols-3 xl:gap-x-8 xl:space-y-0">
          <div className="flex flex-col items-center space-x-2 pt-8">
            {avatar && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatar}
                alt="avatar"
                height="auto"
                className="h-32 w-32 rounded-full object-cover"
              />
            )}
            <h3 className="pb-2 pt-4 text-xl font-bold leading-8 tracking-tight">
              {name}
            </h3>
            <div className="text-gray-500 dark:text-gray-300">{occupation}</div>
            <div className="text-gray-500 dark:text-gray-300">
              {company_name}
            </div>
            <div className="flex space-x-3 pt-6">
              <SocialIcon
                kind="mail"
                href={`mailto:${settings.site_email}`}
                size={5}
              />
              <SocialIcon kind="github" href={social?.github} size={5} />
              <SocialIcon kind="linkedin" href={social?.linkedin} size={5} />
              <SocialIcon kind="twitter" href={social?.twitter} size={5} />
            </div>
          </div>
          <div className="prose max-w-none pb-8 pt-8 dark:prose-dark xl:col-span-2">
            <div dangerouslySetInnerHTML={{ __html: site_description ?? '' }} />
            <br />
            <div dangerouslySetInnerHTML={{ __html: bio ?? '' }} />
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};
