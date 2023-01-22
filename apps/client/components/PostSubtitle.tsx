import classNames from 'classNames';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}

export default function PostSubTitle({ children, className }: Props) {
  const textColor = className ?? 'text-gray-400 dark:text-slate-400';
  return (
    <h1
      className={classNames(
        'py-2 text-lg font-medium  leading-7',
        className,
        textColor
      )}
    >
      {children}
    </h1>
  );
}
