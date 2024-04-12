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
      <div className="relative w-full">
        <div
          style={{
            width: "100%",
            height: "100%",
          }}
          className="absolute top-0 left-0 bg-gradient"
        />
        <img
          src="https://res.cloudinary.com/abhisheksaha/image/upload/c_scale,w_1084/v1712824425/lp_assets/analytics-blue_lhwuso.avif"
          className="w-full md:w-full mt-16 !border-0 md:rounded-md max-h-[34rem] object-top object-cover"
          alt="analytics"
          style={
            {
              // boxShadow: "0 0 95px -1px #3b82f66e",
            }
          }
          data-aos="zoom-in"
          data-aos-delay="200"
        />
      </div>
    </div>
  );
};
