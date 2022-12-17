import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function PageTitle({ children }: Props) {
  return (
    <h1 className="py-2 text-center text-2xl font-extrabold leading-10 tracking-tight text-gray-900 dark:text-gray-100 md:text-4xl md:leading-12">
      {children}
    </h1>
  );
}
