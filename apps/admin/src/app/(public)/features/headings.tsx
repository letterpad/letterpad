import classNames from "classnames";
import { FC } from "react";

interface Props {
  title: string;
  description: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  animation?: string;
}
export const Heading: FC<Props> = ({
  title,
  description,
  size = "md",
  className,
  animation,
}) => {
  return (
    <div
      className={classNames(
        "flex flex-col justify-center items-center",
        className
      )}
    >
      <h2
        className={classNames("font-bold w-full", {
          "text-3xl md:text-3xl": size === "sm",
          "text-3xl md:text-4xl": size === "md",
          "text-4xl": size === "lg",
        })}
        data-aos={animation ?? "fade-down"}
        data-aos-delay="200"
      >
        {title}
      </h2>
      <h3
        className={classNames(
          "py-4 max-w-lg font-heading text-slate-500",
          className,
          {
            "text-md": size === "sm",
            "text-base": size === "md",
            "text-xl": size === "lg",
          }
        )}
        data-aos={animation ?? "fade-down"}
        data-aos-delay="200"
      >
        {description}
      </h3>
    </div>
  );
};
