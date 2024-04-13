import "./style.css";

import { AnimatedBorder } from "./components";
import { Heading } from "./headings";
export const Analytics = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <Heading
        title="Advanced Analytics"
        description="With advanced analytics, you can get insights of your posts. Understand
        the performance of your blog and make data-driven improvements."
        animation="fade-down"
        className="text-center"
      />
      <div className="relative w-full mt-16 ">
        <div className="absolute top-0 left-0 bg-gradient w-full h-full" />
        <AnimatedBorder>
          <img
            src="https://res.cloudinary.com/abhisheksaha/image/upload/c_crop,g_north,h_1102,w_1599/v1713019678/lp_assets/analytics_znlruu.avif"
            className="w-full md:w-full md:rounded-xl max-h-[54rem] object-top object-cover brightness-125"
            alt="analytics"
          />
        </AnimatedBorder>
      </div>
    </div>
  );
};
