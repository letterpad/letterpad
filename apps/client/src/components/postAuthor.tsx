import { PageFragmentFragment, SettingsFragmentFragment } from 'letterpad-sdk';
import { FC } from 'react';
import { ProfileCard } from 'ui/isomorphic';

import { Share } from '@/components/share';

import { getApiRootUrl, getProfileUrl } from '../../lib/utils/url';

interface Props {
  settings: SettingsFragmentFragment;
  post: PageFragmentFragment;
}
export const PostAuthor: FC<Props> = ({ settings, post }) => {
  const { slug, title, excerpt, author, type } = post;
  const isPage = type === 'page';

  const postUrl = `${settings.site_url}${slug}`;

  const trueAuthor = author?.__typename === 'Author' ? author : null;

  const avatar = settings.is_platform
    ? settings.site_logo?.src
    : trueAuthor?.avatar;
  const name = settings.is_platform ? settings.site_title : trueAuthor?.name;
  const line2 = settings.is_platform
    ? settings.site_description
    : trueAuthor?.occupation;

  const link = settings.is_platform
    ? settings.site_url
    : getProfileUrl(trueAuthor?.username!);

  if (isPage) return null;

  return (
    <div className="flex items-start justify-between">
      <ProfileCard
        avatar={avatar!}
        name={name}
        line2={line2}
        size="lg"
        link={link}
        target="_self"
      />
      <Share title={title} summary={excerpt} url={postUrl} />
    </div>
  );
};
