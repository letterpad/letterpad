import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function PageTitle({ children }: Props) {
  return (
    <h1 className="text-4xl font-extrabold leading-10 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl  md:text-4xl md:leading-12">
      {children}
    </h1>
  );
}
