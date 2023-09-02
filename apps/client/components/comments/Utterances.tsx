import React, { useCallback, useEffect, useState } from 'react';

import siteMetadata from '@/data/siteMetadata';

interface Props {
  issueTerm: string;
}

const Utterances = ({ issueTerm }: Props) => {
  const [enableLoadComments, setEnabledLoadComments] = useState(true);

  const commentsTheme =
    localStorage.theme === 'dark'
      ? siteMetadata.comment.utterancesConfig.darkTheme
      : siteMetadata.comment.utterancesConfig.theme;

  const COMMENTS_ID = 'comments-container';

  const LoadComments = useCallback(() => {
    setEnabledLoadComments(false);
    const script = document.createElement('script');
    script.src = 'https://utteranc.es/client.js';
    script.setAttribute(
      'repo',
      siteMetadata.comment.utterancesConfig.repo ?? ''
    );
    script.setAttribute('issue-term', issueTerm);
    script.setAttribute('label', siteMetadata.comment.utterancesConfig.label);
    script.setAttribute('theme', commentsTheme);
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;

    const comments = document.getElementById(COMMENTS_ID);

    if (comments) {
      comments.innerHTML = '';
      comments.appendChild(script);
    }

    return () => {
      const comments = document.getElementById(COMMENTS_ID);
      if (comments) comments.innerHTML = '';
    };
  }, [commentsTheme, issueTerm]);

  // Reload on theme change
  useEffect(() => {
    const iframe = document.querySelector('iframe.utterances-frame');
    if (!iframe) return;
    LoadComments();
  }, [LoadComments]);

  // Added `relative` to fix a weird bug with `utterances-frame` position
  return (
    <div className="pb-6 pt-6 text-center text-gray-700 dark:text-gray-300">
      {enableLoadComments && (
        <button onClick={LoadComments} className="button-primary text-xs">
          Load Comments
        </button>
      )}
      <div className="utterances-frame relative" id={COMMENTS_ID} />
    </div>
  );
};

export default Utterances;
