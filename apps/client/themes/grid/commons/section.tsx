import classNames from 'classnames';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}

export function SectionContainer({ children, className }: Props) {
  return (
    <div className={classNames('px-4 sm:px-4', className)}>
      <div className="flex flex-col justify-between">{children}</div>
    </div>
  );
}
