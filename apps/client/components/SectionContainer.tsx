import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function SectionContainer({ children }: Props) {
  return (
    <div className="content">
      <div className="flex flex-col justify-between">{children}</div>
    </div>
  );
}
