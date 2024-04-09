import { FC } from "react";
import { isPaymentsEnabled } from "ui/server";

import { Banner } from "./banner";
import { SignupLink } from "./signUpLink";

export const BannerAd: FC<{ hasSession: boolean }> = async ({ hasSession }) => {
  const membershipFeatureActive = await isPaymentsEnabled();
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
        membershipFeatureActive ? (
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

                <h3 className="text-xl font-bold my-4">
                  Why choose Letterpad?
                </h3>
                <ul className="flex flex-col gap-2 text-opacity-80">
                  <li>✓ Easy-to-use story creation tools</li>
                  <li>✓ Earn money from reads</li>
                  <li>✓ Build your audience</li>
                  <li>✓ Customise your brand</li>
                  <li>✓ Ai Powered Editor</li>
                  <li>✓ No annoying ads</li>
                </ul>
              </div>
            </div>
          </div>
        ) : null
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
