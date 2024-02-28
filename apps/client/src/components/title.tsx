import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}

export function PageTitle({ children, className }: Props) {
  return (
    <h1
      className={
        'py-2 pb-4 text-3xl font-bold leading-12 tracking-tight md:text-4xl md:leading-12' +
        ' ' +
        className
      }
    >
      {children}
    </h1>
  );
}
