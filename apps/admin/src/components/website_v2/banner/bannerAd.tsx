import { FC } from "react";

import { CtaButtons } from "./cta";
import { HeroText } from "../../../app/(public)/features/hero-text";
import { getServerSession } from "next-auth";
import { options } from "../../../pages/api/auth/[...nextauth]";

export const BannerAd: FC = async () => {
  const session = await getServerSession(options());
  const hasSession = session?.user?.id;
  if (hasSession) return null;
  return (
    <div className="max-w-4xl mx-auto items-center gap-4 px-4 sm:px-6 md:px-10 text-center py-10">
      <div className="space-y-8 mt-10 md:mt-0">
        <HeroText
          addShadow={false}
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
          data-aos-delay="0"
          className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400 font-paragraph"
        >
          Letterpad offers a versatile platform where you can share your
          stories, build an audience, and make money.
        </p>
      </div>
      <CtaButtons />
    </div>
  );
};
