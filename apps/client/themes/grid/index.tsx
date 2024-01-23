import dynamic from 'next/dynamic';

export const HomePage = dynamic(() =>
  import('./home_page').then((mod) => mod.HomePage)
);
export const HomePosts = dynamic(() =>
  import('./home_posts').then((mod) => mod.HomePosts)
);
export { Post } from './post';

export const Preview = dynamic(() =>
  import('./preview').then((mod) => mod.Preview)
);
export const Tag = dynamic(() => import('./tag').then((mod) => mod.Tag));

export { About } from './about';
export { Tags } from './tags';
