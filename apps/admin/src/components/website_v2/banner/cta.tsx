"use client";
import Link from "next/link";
import { Button } from "ui/isomorphic";

import { EventAction, EventCategory, track } from "../../../track";

export const CtaButtons = ({ hasSession }) => {
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
        <Link
          href="/features"
          onClick={() => onClick("features")}
        >
          Learn More
        </Link>
      </Button>
    </div>
  );
};
