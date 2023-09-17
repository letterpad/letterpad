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
        'flex flex-1 flex-col',
        fonts[primary_font].className,
        fonts[secondary_font].variable,
        fonts['Roboto_Mono'].variable // for codeblocks
      )}
    >
      {children}
    </div>
  );
};
