import { FC } from "react";

export const Banner: FC<{ title: string; subTitle?: string }> = ({
  title,
  subTitle,
}) => {
  return (
    <div className="w-full py-20 bg-black text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 justify-between flex-col md:flex-row flex md:items-center md:space-y-0 space-y-10">
        <div className="">
          <h2 className="text-3xl font-bold mb-2 font-heading">{title}</h2>
          <p className="text-lg font-paragraph">{subTitle}</p>
        </div>
      </div>
    </div>
  );
};
