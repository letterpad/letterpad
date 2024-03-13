// You do not have to edit this page

import dynamic from 'next/dynamic';

export const HomePosts = dynamic(() =>
  import('./home_posts').then((mod) => mod.HomePosts)
);

export const PreHeader = dynamic(() =>
  import('./pre_header').then((mod) => mod.PreHeader)
);
