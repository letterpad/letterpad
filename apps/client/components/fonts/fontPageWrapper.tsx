'use client';
import classNames from 'classnames';

import { fonts } from './fonts';

export const FontPageWrapper = ({
  children,
  primary_font = 'Inter',
  secondary_font = 'PT_Serif',
}) => {
  return (
    <div
      className={classNames(
        fonts[primary_font].className,
        fonts[secondary_font].variable,
        fonts['Roboto_Mono'].variable // for codeblocks
      )}
    >
      {children}
      <style jsx global>
        {`
          h1,
          h2,
          h3 {
            font-family: var(
              --font-${secondary_font?.replaceAll('_', '-')?.toLowerCase()}
            ) !important;
          }
        `}
      </style>
    </div>
  );
};
