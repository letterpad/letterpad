import { EventAction, track } from "@/track";

import Illustration from "/public/website/hero-illustration.svg";

function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Bg gradient */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 -z-10 h-[10rem] bg-gradient-to-t from-gray-800 to-gray-900 opacity-60"
        aria-hidden="true"
      />
      {/* Illustration */}
      <div
        className="pointer-events-none absolute left-1/2 -z-10 -translate-x-1/2"
        aria-hidden="true"
      >
        <img
          src={Illustration.src}
          className="max-w-none"
          width="2143"
          height="737"
          alt="Hero Illustration"
        />
      </div>
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="pb-12 pt-32 md:pb-20 md:pt-40">
          {/* Hero content */}
          <div className="mx-auto max-w-xl text-center md:mx-0 md:max-w-[640px] md:text-left">
            <div data-aos="zoom-out">
              <div className="relative mb-6 inline-block rounded-full bg-gray-800 px-4 py-1 text-sm text-gray-300 before:absolute before:inset-0 before:-z-10 before:-m-0.5 before:rounded-full before:bg-gradient-to-t before:from-gray-800 before:via-gray-600 before:to-gray-800 before:content-['']">
                <div className="text-gray-400">
                  Launched Creatives.{" "}
                  <a
                    className="group inline-flex items-center font-medium text-blue-500 transition duration-150 ease-in-out"
                    href="/try-creatives"
                  >
                    Check Demo{" "}
                    <span className="ml-1 font-inter tracking-normal transition-transform duration-150 ease-in-out group-hover:translate-x-0.5">
                      -&gt;
                    </span>
                  </a>
                </div>
              </div>
            </div>
            <h1
              className="h1 mb-6 font-uncut-sans"
              data-aos="zoom-out"
              data-aos-delay="100"
            >
              A publishing platform for{" "}
              <em className="font-italic">creative</em> people
            </h1>
            <p
              className="mb-10 text-xl text-gray-400"
              data-aos="zoom-out"
              data-aos-delay="200"
            >
              Discover a world of possibilities for your writing and creativity
              on Letterpad, the premier blogging platform for creative
              expression.
            </p>
            <div
              className="mx-auto max-w-xs space-y-4 sm:flex sm:max-w-none sm:justify-center sm:space-x-4 sm:space-y-0 md:justify-start"
              data-aos="zoom-out"
              data-aos-delay="300"
            >
              <div>
                <a
                  className="btn group w-full bg-gradient-to-t from-blue-600 to-blue-400 text-white shadow-lg hover:to-blue-500"
                  href="/register"
                  onClick={() => {
                    track({
                      eventAction: EventAction.Click,
                      eventCategory: "register",
                      eventLabel: `Hero-CTA`,
                    });
                  }}
                >
                  Get Started For Free{" "}
                  <span className="ml-1 font-inter tracking-normal text-blue-200 transition-transform duration-150 ease-in-out group-hover:translate-x-0.5">
                    -&gt;
                  </span>
                </a>
              </div>
              <div>
                <a
                  className="btn w-full bg-gradient-to-t from-gray-800 to-gray-700 text-gray-300 shadow-lg hover:to-gray-800"
                  href="https://docs.letterpad.app"
                  onClick={() => {
                    track({
                      eventAction: EventAction.Click,
                      eventCategory: "docs",
                      eventLabel: `header`,
                    });
                  }}
                >
                  Explore Docs
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
