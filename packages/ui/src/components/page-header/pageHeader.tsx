import { ReactNode } from "react";

interface PageHeaderProps {
  title: string | ReactNode;
  extra?: ReactNode[];
  subTitle?: string;
  actions?: React.ReactNode;
  className: string;
  children: ReactNode;
}

export const PageHeader = (props: PageHeaderProps) => {
  return (
    <div className="mb-4 flex flex-col justify-between border-b-[1px]  border-gray-300 pb-4 dark:border-gray-800">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">{props.title}</h1>
        <div>{props.extra}</div>
      </div>
      <div className="mt-4 text-base">{props.children}</div>
    </div>
  );
};
