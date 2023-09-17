'use client';

import React, { FC, useCallback, useEffect, useState } from 'react';

import siteMetadata from '@/data/siteMetadata';

interface Props {
  mapping: string;
}

const Giscus: FC<Props> = ({ mapping }) => {
  const [enableLoadComments, setEnabledLoadComments] = useState(true);
  // const { theme, resolvedTheme } = getTheme();
  const commentsTheme =
    siteMetadata.comment.giscusConfig.themeURL === ''
      ? localStorage.theme === 'dark'
        ? siteMetadata.comment.giscusConfig.darkTheme
        : siteMetadata.comment.giscusConfig.theme
      : siteMetadata.comment.giscusConfig.themeURL;

  const COMMENTS_ID = 'comments-container';

  const LoadComments = useCallback(() => {
    setEnabledLoadComments(false);
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute(
      'data-repo',
      siteMetadata.comment.giscusConfig.repo ?? ''
    );
    script.setAttribute(
      'data-repo-id',
      siteMetadata.comment.giscusConfig.repositoryId ?? ''
    );
    script.setAttribute(
      'data-category',
      siteMetadata.comment.giscusConfig.category ?? ''
    );
    script.setAttribute(
      'data-category-id',
      siteMetadata.comment.giscusConfig.categoryId ?? ''
    );
    script.setAttribute('data-mapping', mapping);
    script.setAttribute(
      'data-reactions-enabled',
      siteMetadata.comment.giscusConfig.reactions
    );
    script.setAttribute(
      'data-emit-metadata',
      siteMetadata.comment.giscusConfig.metadata
    );
    script.setAttribute('data-theme', commentsTheme);
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;

    const comments = document.getElementById(COMMENTS_ID);
    if (comments) comments.appendChild(script);

    return () => {
      const comments = document.getElementById(COMMENTS_ID);
      if (comments) comments.innerHTML = '';
    };
  }, [commentsTheme, mapping]);

  // Reload on theme change
  useEffect(() => {
    const iframe = document.querySelector('iframe.giscus-frame');
    if (!iframe) return;
    LoadComments();
  }, [LoadComments]);

  return (
    <div className="pb-6 pt-6 text-center text-gray-700 dark:text-gray-300">
      {enableLoadComments && (
        <button onClick={LoadComments}>Load Comments</button>
      )}
      <div className="giscus" id={COMMENTS_ID} />
    </div>
  );
};

export default Giscus;
