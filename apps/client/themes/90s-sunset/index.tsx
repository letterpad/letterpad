// Export HomePosts component dynamically for the "90s sunset" theme
import dynamic from 'next/dynamic';

export const HomePosts = dynamic(() =>
  import('./home_posts').then((mod) => mod.HomePosts)
);
