import { FC } from "react";

import { Banner } from "./banner";
import { SignupLink } from "./signUpLink";
import { isMembershipFeatureActive } from "../../../shared/utils";

export const BannerAd: FC<{ hasSession: boolean }> = ({ hasSession }) => {
  const membershipFeatureActive = isMembershipFeatureActive();
  return (
    <Banner
      particles={250}
      title="What's your story today?"
      description=""
      rightReactNode={
        membershipFeatureActive ? (
          <div className="z-10 flex-1 justify-center flex items-center w-full bg-gray-900 rounded-lg font-heading shadow-md">
            <div className="p-12 ">
              <h1 className="text-2xl md:text-2xl font-extrabold">
                Share your stories and support Authors
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
                <ul className="flex flex-col gap-2 text-slate-200">
                  <li>✓ Easy-to-use story creation tools</li>
                  <li>✓ Earn money from reads</li>
                  <li>✓ Build your audience</li>
                  <li>✓ Customise your brand</li>
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
