// 'use client';
import classNames from 'classnames';

// import { fonts } from './fonts';

export const FontPageWrapper = ({
  children,
  primary_font = 'Inter',
  secondary_font = 'PT_Serif',
}) => {
  return (
    <div style={{ fontFamily: `'${primary_font.replace(/_/g, ' ')}'` }}>
      {children}
    </div>
  );
};
