import { Letterpad } from 'letterpad-sdk';

import { getPosts } from './data';
import { getApiUrl } from '../lib/utils/url';

function getLetterpad() {
  const host = window.location.host;
  return new Letterpad({
    letterpadServer: {
      url: getApiUrl() ?? '',
      token: process.env.NEXT_PUBLIC_CLIENT_ID!,
      host: host.replace('www.', ''),
    },
  });
}
export const getPosts1 = async () => {
  return await getPosts();
  const letterpad = getLetterpad();
  const posts = await letterpad.listPosts('/', 2);
  return posts;
};
