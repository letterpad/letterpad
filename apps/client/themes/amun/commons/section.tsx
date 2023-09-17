import classNames from 'classnames';
import { FC, ReactNode } from 'react';

export const Section: FC<{ className?: string; children: ReactNode }> = ({
  children,
  className,
}) => {
  return (
    <div className={classNames('mx-auto sm:px-8 md:max-w-[1480px]', className)}>
      {children}
    </div>
  );
};
