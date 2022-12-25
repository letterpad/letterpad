import { Letterpad } from 'letterpad-sdk';
import { InferGetServerSidePropsType } from 'next';

import AuthorLayout from '@/layouts/AuthorLayout';

export default function About({
  settings,
  me,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {
    name,
    social,
    avatar = '/static/images/avatar.png',
    bio,
    occupation,
    company_name,
  } = me;
  const { site_email } = settings;
  return (
    <AuthorLayout
      site_title={settings.site_title}
      site_url={settings.site_url + 'page/about'}
      data={{
        avatar: avatar || '/static/images/avatar.png',
        name,
        github: social?.github,
        twitter: social?.twitter,
        email: site_email,
        company: company_name,
        linkedin: social?.linkedin,
        occupation,
        banner: settings.banner?.src,
      }}
    >
      <div dangerouslySetInnerHTML={{ __html: bio ?? '' }} />
    </AuthorLayout>
  );
}

export async function getServerSideProps(context: any) {
  const letterpad = new Letterpad({
    letterpadServer: {
      url: process.env.API_URL!,
      token: process.env.CLIENT_ID!,
      host: context.req.headers.host,
    },
  });

  const me = await letterpad.getAuthor();
  const settings = await letterpad.getSettings();

  return {
    props: { me, settings },
  };
}
