import dynamic from 'next/dynamic';

export const HomePage = dynamic(() =>
  import('./home_page').then((mod) => mod.HomePage)
);
export const HomePosts = dynamic(() =>
  import('./home_posts').then((mod) => mod.HomePosts)
);
