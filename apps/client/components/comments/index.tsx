'use client';

import { FC } from 'react';

import { CommentProviders } from './types';

interface Props {
  provider: CommentProviders;
}

import DisqusComponent from '@/components/comments/Disqus';
import GiscusComponent from '@/components/comments/Giscus';
import UtterancesComponent from '@/components/comments/Utterances';

const Comments: FC<Props> = ({ provider }) => {
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
