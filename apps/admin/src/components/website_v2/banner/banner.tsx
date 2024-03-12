import { FC, ReactNode } from "react";

import Particles from "../particles/particles";

interface Props {
  title: string | ReactNode;
  description: string;
  children?: React.ReactNode;
  rightReactNode?: React.ReactNode;
  particles?: number;
}
export const Banner: FC<Props> = ({
  children,
  title,
  description,
  rightReactNode,
  particles = 150,
}) => {
  return (
    <div className="w-full pb-10 py-10 md:py-20 bg-gradient-to-b from-slate-950 to-slate-900 text-white relative h-full">
      <Particles
        className="absolute inset-0 pointer-events-none"
        quantity={particles}
      />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 justify-between flex-col md:flex-row flex md:items-center md:space-y-0 space-y-10 min-h-40 z-10 relative">
        <div className={!!rightReactNode ? "md:w-1/2 hidden md:block" : ""}>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">{title}</h2>
          <p className="text-sm md:text-lg">{description}</p>
          {children}
        </div>
        {rightReactNode}
      </div>
    </div>
  );
};
