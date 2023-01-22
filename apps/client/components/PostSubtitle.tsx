import classNames from 'classnames';
import { ReactNode } from 'react';

interface Props {
  text?: string | null;
  className?: string;
}

export default function PostSubTitle({ text, className }: Props) {
  if (!text) return null;
  const textColor = className ?? 'text-gray-400 dark:text-slate-400';
  return (
    <h1
      className={classNames(
        'py-2 text-lg font-medium  leading-7',
        className,
        textColor
      )}
    >
      {text}
    </h1>
  );
}
