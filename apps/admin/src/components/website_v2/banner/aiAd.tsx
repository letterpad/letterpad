import { CgClose } from "@react-icons/all-files/cg/CgClose";
import { cookies } from "next/headers";
import { EventAction, EventCategory, EventLabel } from "ui/dist/isomorphic.mjs";

import { onClose } from "./action";
import { ClickAndTrack } from "../click";

export function AiAd() {
  const cookie = cookies();
  const show = cookie.get("showAiAd")?.value !== "false";

  if (!show) return null;
  return (
    <div className="relative isolate flex items-center gap-x-6 overflow-hidden bg-black dark:bg-slate-800 px-6 py-2.5 sm:px-3.5 sm:before:flex-1 dark:text-white text-white">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="text-sm leading-6 ">
          <strong className="font-semibold">Do more with less</strong>
          <svg
            viewBox="0 0 2 2"
            className="mx-2 inline h-0.5 w-0.5 fill-current"
            aria-hidden="true"
          >
            <circle cx={1} cy={1} r={1} />
          </svg>
          Explore our innovative AI assistive writing features.
        </p>
        <ClickAndTrack
          href="/features"
          className="flex-none border-b border-white text-sm"
          trackOptions={{
            eventAction: EventAction.Click,
            eventCategory: EventCategory.AiAdBanner,
            eventLabel: EventLabel.ReadMore,
          }}
        >
          Read more <span aria-hidden="true">&rarr;</span>
        </ClickAndTrack>
      </div>
      <div className="flex flex-1 justify-end">
        <form action={onClose}>
          <button
            type="submit"
            className="-m-3 p-3 focus-visible:outline-offset-[-4px]"
          >
            <span className="sr-only">Dismiss</span>
            <CgClose className="h-5 w-5 dark:text-white" aria-hidden="true" />
          </button>
        </form>
      </div>
    </div>
  );
}
