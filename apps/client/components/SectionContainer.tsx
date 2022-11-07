import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function SectionContainer({ children }: Props) {
  return (
    <div className="mx-auto max-w-3xl px-6 xl:max-w-5xl xl:px-0">
      <div className="flex flex-col justify-between">{children}</div>
    </div>
  );
}
