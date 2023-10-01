"use client";
import classNames from "classnames";
import { FC, PropsWithChildren } from "react";

import { fonts } from "./fonts";

interface Props {
  primary_font?: keyof typeof fonts;
  secondary_font?: keyof typeof fonts;
  className?: string;
}

export const FontPageWrapper: FC<PropsWithChildren<Props>> = ({
  children,
  primary_font = "Noto_Sans",
  secondary_font = "PT_Serif",
  className,
}) => {
  return (
    <div
      className={classNames(
        className,
        fonts[primary_font].className,
        fonts[primary_font].variable,
        fonts[secondary_font].variable,
        fonts["Roboto_Mono"].variable // for codeblocks
      )}
    >
      {children}
      <style jsx global>
        {`
          h1,
          h2,
          h3 {
            font-family: var(
              --font-${secondary_font?.replaceAll("_", "-")?.toLowerCase()}
            ) !important;
          }
          .prose {
            font-family: var(
              --font-${primary_font?.replaceAll("_", "-")?.toLowerCase()}
            ) !important;
          }
        `}
      </style>
    </div>
  );
};
