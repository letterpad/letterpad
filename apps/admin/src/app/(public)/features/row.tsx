import classNames from "classnames";
import { FC, ReactNode } from "react";

interface Props {
  title: string | ReactNode;
  caption: string | ReactNode;
  imgSrc: string;
  reverse?: boolean;
  imgAlt: string;
}
export const Row: FC<Props> = ({
  title,
  caption,
  imgSrc,
  reverse = false,
  imgAlt,
}) => {
  return (
    <div
      className={classNames(
        "flex flex-col lg:flex-row mt-28 lg:mt-52 gap-10 items-center",
        {
          "lg:flex-row-reverse": reverse,
        }
      )}
    >
      <div className="flex flex-col items-center lg:items-start space-y-4 max-w-96">
        <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800 dark:text-gray-100">
          Do more with less
        </div>
        <div className="grid gap-2">
          <p className=" text-gray-500 dark:text-gray-300 text-lg">{title}</p>
          <p className="text-gray-400 dark:text-gray-400 font-paragraph">
            {caption}
          </p>
        </div>
      </div>
      <div className="flex flex-col lg:p-10  -ml-11 -mr-11 sm:ml-0 sm:mr-0">
        {/* <img
          src={imgSrc}
          alt={imgAlt}
          className="lg:rounded-2xl lpImg "
          //   style={{ boxShadow: "0 0 40rem -3rem #0092ff" }}
        /> */}
        <video width="100%" height="100%" controls className="lpImg">
          <source src={imgSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <style>
          {`
          img.lpImg {
            box-shadow: 0 0 9rem -1rem #3b82f6de;
        }
            .dark img.lpImg {
                box-shadow: 0 0 40rem -3rem #3b82f6;
            }
            
            `}
        </style>
      </div>
    </div>
  );
};
