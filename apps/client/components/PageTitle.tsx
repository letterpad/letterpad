import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}

export default function PageTitle({ children, className }: Props) {
  const textColor = className ?? 'text-gray-900 dark:text-gray-100';
  return (
    <h1
      className={
        'text-center text-3xl font-extrabold leading-10 tracking-tight md:py-2  md:text-5xl md:leading-12 ' +
        className
      }
    >
      {children}
    </h1>
  );
}
