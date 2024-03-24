import { getPreviewData } from '@/data';

import Custom404 from '@/app/not-found';

interface PreviewPostLayoutProps {
  children?: React.ReactNode;
  katex: React.ReactNode;
  params: { hash: string };
}

export default async function PostPageLayout({
  children,
  params,
  katex,
}: PreviewPostLayoutProps) {
  const data = await getPreviewData(params.hash);
  if (!data?.post || !data?.settings || !data?.me) {
    return <Custom404 />;
  }

  if (data.post.html?.includes('letterpad-katex')) {
    return (
      <>
        {katex}
        {children}
      </>
    );
  }

  return <>{children}</>;
}
