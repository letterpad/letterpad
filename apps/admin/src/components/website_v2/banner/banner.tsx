"use client";

import { FC } from "react";

import Particles from "../particles/particles";

interface Props {
  title: string;
  description: string;
  children?: React.ReactNode;
}
export const Banner: FC<Props> = ({ children, title, description }) => {
  return (
    <div className="w-full py-20 bg-black text-white relative">
      <Particles
        className="absolute inset-0 pointer-events-none"
        quantity={150}
      />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 justify-between flex-col md:flex-row flex md:items-center md:space-y-0 space-y-10">
        <div className="">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          <p className="text-lg">{description}</p>
        </div>
        {children}
      </div>
    </div>
  );
};
