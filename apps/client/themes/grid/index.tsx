import dynamic from 'next/dynamic';

export const HomePage = dynamic(() =>
  import('./home_page').then((mod) => mod.HomePage)
);
export const HomePosts = dynamic(() =>
  import('./home_posts').then((mod) => mod.HomePosts)
);
export { Post } from './post';
// export const Post = dynamic(() => import('./post').then((mod) => mod.Post));
export const Preview = dynamic(() =>
  import('./preview').then((mod) => mod.Preview)
);
export const Tag = dynamic(() => import('./tag').then((mod) => mod.Tag));
export { Tags } from './tags';
// export const Tags = dynamic(() => import('./tags').then((mod) => mod.Tags));
export const About = dynamic(() => import('./about').then((mod) => mod.About));
// export const Layout = dynamic(() =>
//   import('./_layout').then((mod) => mod.Layout)
// );
export { Layout } from './_layout';
