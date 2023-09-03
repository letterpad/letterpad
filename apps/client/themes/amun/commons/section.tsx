import classNames from 'classnames';
import { FC, ReactNode } from 'react';

export const Section: FC<{ className?: string; children: ReactNode }> = ({
  children,
  className,
}) => {
  return (
    <div
      className={classNames('mx-auto max-w-[1480px] px-5 sm:px-8', className)}
    >
      {children}
    </div>
  );
};
