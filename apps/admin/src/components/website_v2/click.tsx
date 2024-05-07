"use client";
import Link from "next/link";
import { FC, HTMLAttributeAnchorTarget, ReactNode } from "react";
import { EventInfo } from "ui/isomorphic";

import { track } from "../../track";

interface Props {
  children: ReactNode;
  href: string;
  className?: string;
  target?: HTMLAttributeAnchorTarget;
  trackOptions?: EventInfo;
}

export const ClickAndTrack: FC<Props> = ({
  children,
  href,
  className,
  target = "_self",
  trackOptions,
}) => {
  const onClick = () => {
    if (trackOptions) track(trackOptions);
  };
  return (
    <Link href={href} className={className} target={target} onClick={onClick}>
      {children}
    </Link>
  );
};
