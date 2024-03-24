// export const runtime = 'edge';

import { Suspense } from 'react';

import { BlogPost } from '@/features/post/blogPost';
import { Skeleton } from '@/features/post/skeleton';

export default async function Post(props) {
  return (
    <Suspense fallback={<Skeleton />}>
      <BlogPost {...props} />
    </Suspense>
  );
}
