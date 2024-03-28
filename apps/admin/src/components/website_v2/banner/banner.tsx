import { FC, ReactNode } from "react";

interface Props {
  title: string | ReactNode;
  description: string;
  children?: React.ReactNode;
  rightReactNode?: React.ReactNode;
}
export const Banner: FC<Props> = ({
  children,
  title,
  description,
  rightReactNode,
}) => {
  return (
    <div className="w-full pb-10 py-10 md:py-20 bg-gradient-to-b bg-brand text-black relative h-full">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 justify-between flex-col md:flex-row flex md:items-center md:space-y-0 space-y-10 min-h-40 z-10 relative">
        <div className={!!rightReactNode ? "md:w-1/2 hidden md:block " : ""}>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">{title}</h2>
          <p className="text-sm md:text-lg">{description}</p>
          {children}
        </div>
        {rightReactNode}
      </div>
    </div>
  );
};
