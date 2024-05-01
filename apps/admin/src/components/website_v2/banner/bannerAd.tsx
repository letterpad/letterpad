import { FC } from "react";

import { Banner } from "./banner";
import { SignupLink } from "./signUpLink";
import { CustomLink } from "../../../app/(public)/features/components";
import { HeroText } from "../../../app/(public)/features/hero-text";

export const BannerAd: FC<{ hasSession: boolean }> = async ({ hasSession }) => {
  return (
    <div className="max-w-5xl mx-auto items-center gap-4 px-4 sm:px-6 md:px-10 text-center py-20">
      <div className="space-y-8 mt-10 md:mt-0">
        {/* <div
      data-aos="fade-down"
      data-aos-easing="linear"
      data-aos-duration="200"
      className="inline-block rounded-full bg-blue-500 px-3 py-1 text-sm text-white"
    >
      New Features
    </div> */}
        <HeroText
          headline={
            <div className="font-bold">
              Share your <span className="">stories</span> and{" "}
              <span className=" text-nowrap">earn</span> money.
            </div>
          }
        />
        <p
          data-aos="fade-down"
          data-aos-easing="linear"
          data-aos-duration="200"
          className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400 font-paragraph"
        >
          Letterpad offers a versatile platform where you can share your
          stories, build an audience, and make money.
        </p>
      </div>
      <div className="flex items-center justify-center my-10 gap-4">
        <CustomLink href="/register?ref=features-cta">Signup</CustomLink>
        <CustomLink href="/features">Explore</CustomLink>
      </div>
    </div>
  );
  return (
    <Banner
      title={
        <div className="text-7xl font-extralight font-serif">
          Whats your <br />
          <span className="text-white">story</span> today?
          {/* <Animate /> */}
        </div>
      }
      description=""
      rightReactNode={
        <div className="z-10 flex-1 justify-center flex items-center w-full md:border-l md:border-slate-800">
          <div className="p-12 ">
            <h1 className="text-2xl md:text-2xl font-extrabold">
              Share your <span className="italic">stories</span> and{" "}
              <span className="italic text-nowrap">earn</span>.
            </h1>
            <p className="text-md mt-4">
              Letterpad offers a versatile platform where you can share your
              stories, build an audience, and make money.
            </p>
            <div>
              {!hasSession ? <SignupLink /> : <div className="py-5" />}

              {/* <h3 className="text-xl font-bold my-4">Why choose Letterpad?</h3>
              <ul className="flex flex-col gap-2 text-opacity-80">
                <li>✓ Easy-to-use story creation tools</li>
                <li>✓ Earn money from reads</li>
                <li>✓ Build your audience</li>
                <li>✓ Customise your brand</li>
                <li>✓ Ai Powered Editor</li>
                <li>✓ No annoying ads</li>
              </ul> */}
            </div>
          </div>
        </div>
      }
    />
  );
};

const Animate = () => {
  return (
    <h2 className="sentence py-10">
      <div className="slidingVertical flex flex-col">
        <span>story</span>
        <span>thought</span>
        <span>rant</span>
        <span>idea</span>
        <span>learning</span>
      </div>
    </h2>
  );
};
