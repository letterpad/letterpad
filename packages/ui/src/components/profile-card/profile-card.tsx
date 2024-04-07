import classNames from "classnames";
import Link from "next/link";
import { FC, ReactNode } from "react";

interface Props {
  link: string;
  avatar: string;
  name: string | ReactNode;
  showProLabel?: boolean;
  line2?: string | ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  target?: React.HTMLAttributeAnchorTarget;
}
export const ProfileCard:FC<Props> = ({
  link,
  avatar,
  name,
  showProLabel = false,
  line2 = "",
  size = "md",
  className,
  target = "_blank",
}) => {
  return (
    <Link
      className={classNames("flex justify-left flex-row gap-2", className, {
        "items-center": true,
        "gap-4": size === "xl",
      })}
      href={link}
      target={target}
    >
      <div className="rounded-full flex-none ">
        <img
          src={avatar?.replace("image/upload", "image/upload/c_scale,w_200")}
          alt={"Author name"}
          loading="lazy"
          className={classNames("object-cover rounded-full bg-slate-200", {
            "w-6 h-6": size === "xs",
            "w-7 h-7": size === "sm",
            "w-8 h-8": size === "md",
            "w-12 h-12": size === "lg",
            "w-20 h-20": size === "xl",
          })}
        />
      </div>

      <div>
        <div
          className={classNames("gap-2 items-center flex", {
            "text-sm": size === "xs",
            "text-md": size === "sm",
            "text-lg": size === "md",
            "font-bold text-md": size === "lg",
            "text-xl md:text-3xl": size === "xl",
          })}
        >
          <span className={classNames({ "font-bold": size === "xl" })}>{name}</span>
          {showProLabel && (
            <span
              className={classNames(
                {
                  "py-0.5 px-1.5 text-[0.5rem]": size === "xs",
                  "py-0.5 px-1.5 text-[0.6rem]": size === "sm",
                  "py-1 px-2 text-[0.7rem]": size === "md",
                  "py-1 px-2 text-[0.7rem] !rounded-md": size === "lg",
                  "py-1 px-2 text-[0.8rem] !rounded-md": size === "xl",
                },
                " bg-blue-500 text-white rounded-sm font-bold"
              )}
            >
              PRO
            </span>
          )}
        </div>
        <div
          className={classNames("text-gray-500 truncate dark:text-gray-400", {
            "text-xs": size === "xs",
            "text-sm": size === "sm" || size === "lg",
            "text-md": size === "md" ,
            "text-lg": size === "xl",
          })}
        >
          {line2}
        </div>
      </div>
    </Link>
  );
};
