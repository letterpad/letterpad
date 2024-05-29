"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { AuthModal, Button } from "ui/dist/index.mjs";

import { EventAction, EventCategory, track } from "../../../track";

export const CtaButtons = () => {
  const session = useSession();
  const [source, setSource] = useState("");
  useEffect(() => {
    const source = typeof window !== "undefined" ? window.location.href : "";
    setSource(source);
  }, []);
  const hasSession = !!session.data?.user?.id || session.status === "loading";

  const onClick = (label: string) => {
    track({
      eventAction: EventAction.Click,
      eventCategory: EventCategory.HeroBanner,
      eventLabel: label,
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
        <AuthModal
          TriggerComponent={<Button>Register</Button>}
          source={source}
          view="register"
        />
      ) : null}
      <Button variant={"outline"}>
        <Link href="/features" onClick={() => onClick("features")}>
          Pro Features
        </Link>
      </Button>
    </div>
  );
};
