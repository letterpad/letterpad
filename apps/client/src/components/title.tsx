import classNames from 'classnames';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}

export function PageTitle({ children, className }: Props) {
  return (
    <h1
      className={classNames(
        'py-2 pb-2 text-3xl font-bold leading-8 tracking-tight md:text-4xl md:leading-10',
        className
      )}
    >
      {children}
    </h1>
  );
}
