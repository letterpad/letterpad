import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  extra?: ReactNode[];
  subTitle?: string;
  actions?: React.ReactNode;
  className: string;
  children: ReactNode;
}

export const PageHeader = (props: PageHeaderProps) => {
  return (
    <div className="mb-4 flex justify-between border-b-[1px]  border-gray-300 pb-4 dark:border-gray-800">
      <div>
        <h1 className="text-xl font-bold">{props.title}</h1>
        <div className="mt-8 text-base">{props.children}</div>
      </div>
      <div>{props.extra}</div>
    </div>
  );
};
