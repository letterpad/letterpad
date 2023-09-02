import React from "react";

import { EventAction, track } from "@/utils/useTracking";

import Illustration from "/public/website/cta-illustration.svg";

function Cta() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* CTA box */}
        <div
          className="relative overflow-hidden rounded bg-gradient-to-tr from-blue-600 to-purple-500 px-8 py-10 md:px-12 md:py-16"
          data-aos="zoom-out"
        >
          {/* Bg illustration */}
          <div
            className="absolute right-0 top-1/2 -z-10 mt-8 hidden -translate-y-1/2 lg:block"
            aria-hidden="true"
          >
            <img
              src={Illustration}
              className="max-w-none"
              width="582"
              height="662"
              alt="Illustration"
            />
          </div>
          <div className="flex flex-col items-center justify-between lg:flex-row">
            {/* CTA content */}
            <div className="mb-6 text-center lg:mb-0 lg:mr-16 lg:text-left">
              <h3 className="mb-2 font-uncut-sans text-4xl font-bold">
                Get started with Letterpad
              </h3>
              <p className="text-blue-200">
                It only takes a few seconds to get started with Letterpad.
              </p>
            </div>
            {/* CTA button */}
            <div className="shrink-0">
              <a
                className="btn-sm group w-full bg-gradient-to-t from-blue-600 to-blue-400 text-white shadow-lg hover:to-blue-500"
                href="/register"
                onClick={() => {
                  track({
                    eventAction: EventAction.Click,
                    eventCategory: "register",
                    eventLabel: `cta-button`,
                  });
                }}
              >
                Start Now{" "}
                <span className="ml-1 tracking-normal text-blue-200 transition-transform duration-150 ease-in-out group-hover:translate-x-0.5">
                  -&gt;
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Cta;
