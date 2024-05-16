"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "ui/dist/isomorphic.mjs"; // removed isomorphic;

import { EventAction, EventCategory, track } from "../../../track";

export const CtaButtons = () => {
  const session = useSession();

  const hasSession = !!session.data?.user?.id || session.status === "loading";

  const onClick = (e) => {
    track({
      eventAction: EventAction.Click,
      eventCategory: EventCategory.HeroBanner,
      eventLabel: e.target.innerText,
    });
  };
  return (
    <div
      className="flex items-center justify-center my-10 gap-4"
      data-aos="fade-down"
      data-aos-easing="linear"
      data-aos-duration="200"
    >
      {!hasSession ? (
        <Button variant={"primary"}>
          <Link href="/register" onClick={() => onClick("register")}>
            Register
          </Link>
        </Button>
      ) : null}
      <Button variant={"outline"}>
        <Link href="/features" onClick={() => onClick("features")}>
          Pro Features
        </Link>
      </Button>
    </div>
  );
};
