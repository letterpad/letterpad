import { PageFragmentFragment, SettingsFragmentFragment } from 'letterpad-sdk';
import { FC } from 'react';
import { ProfileCard } from 'ui/isomorphic';

import { Share } from '@/components/share';

import { getApiRootUrl } from '../../lib/utils/url';

interface Props {
  settings: SettingsFragmentFragment;
  post: PageFragmentFragment;
}
export const PostAuthor: FC<Props> = ({ settings, post }) => {
  const { slug, title, excerpt, author, type } = post;
  const isPage = type === 'page';

  const postUrl = `${settings.site_url}${slug}`;

  const trueAuthor = author?.__typename === 'Author' ? author : null;
  const link = settings.is_platform
    ? settings.site_url
    : `${getApiRootUrl()}/@${trueAuthor?.username!}`;

  if (isPage) return null;

  return (
    <div className="flex items-start justify-between">
      <ProfileCard
        avatar={trueAuthor?.avatar!}
        name={trueAuthor?.name!}
        line2={<span className="text-md">{trueAuthor?.occupation!}</span>}
        size="lg"
        link={link}
        target="_self"
      />
      <Share title={title} summary={excerpt} url={postUrl} />
    </div>
  );
};
