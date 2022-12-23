import gql from 'graphql-tag';
import { InferGetServerSidePropsType } from 'next';
import { meFragment, settingsFragment } from 'queries/queries';

import { fetchProps } from '@/lib/client';
import { AboutQueryQuery, AboutQueryQueryVariables } from '@/lib/graphql';

import AuthorLayout from '@/layouts/AuthorLayout';

const aboutQuery = gql`
  query AboutQuery {
    ...me
    ...settings
  }
  ${meFragment}
  ${settingsFragment}
`;

export default function About({
  settings,
  me,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (me?.__typename !== 'Author') return <div>Author not found</div>;
  if (settings.__typename !== 'Setting') return <div>Setting not found</div>;

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
  const response = await fetchProps<AboutQueryQuery, AboutQueryQueryVariables>(
    aboutQuery,
    {},
    context.req.headers.host
  );

  return {
    props: response.props.data,
  };
}
