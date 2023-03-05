import dynamic from 'next/dynamic';

export const HomePage = dynamic(() =>
  import('./home_page').then((mod) => mod.HomePage)
);
export const HomePosts = dynamic(() =>
  import('./home_posts').then((mod) => mod.HomePosts)
);
export const Post = dynamic(() => import('./post').then((mod) => mod.Post));
export const Preview = dynamic(() =>
  import('./preview').then((mod) => mod.Preview)
);
export const Tag = dynamic(() => import('./tag').then((mod) => mod.Tag));
export const Layout = dynamic(() =>
  import('./_layout').then((mod) => mod.Layout)
);
