'use client';
import dynamic from 'next/dynamic';

import { CommentProviders } from './types';

interface Props {
  provider: CommentProviders;
}

const UtterancesComponent = dynamic(
  () => import('@/components/comments/Utterances'),
  {
    ssr: false,
  }
);

const GiscusComponent = dynamic(() => import('@/components/comments/Giscus'), {
  ssr: false,
});

const DisqusComponent = dynamic(() => import('@/components/comments/Disqus'), {
  ssr: false,
});

const Comments = ({ provider }: Props) => {
  const term =
    typeof window !== 'undefined'
      ? window.location?.origin + window.location.pathname
      : '';

  return (
    <div id="comment">
      {provider === 'giscus' && <GiscusComponent mapping={term} />}
      {provider === 'utterances' && <UtterancesComponent issueTerm={term} />}
      {provider === 'disqus' && <DisqusComponent />}
    </div>
  );
};

export default Comments;
