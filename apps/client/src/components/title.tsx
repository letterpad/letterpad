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
        'py-2 pb-2 text-3xl font-medium leading-9 tracking-tight md:text-5xl md:leading-14 font-serif',
        className
      )}
    >
      {children}
    </h1>
  );
}
