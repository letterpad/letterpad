import { Heading } from "./headings";

export const Toc = () => {
  return (
    <>
      <Heading
        title="Generate Table of Contents"
        description="Generate Table of Contents with one click. Make your
    articles more readable and SEO friendly."
      />
      <div className="relative w-full mt-10">
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            background: "#7a86a830",
            filter: "blur(120px) brightness(1.2)",
          }}
        ></div>
        <img
          src="https://res.cloudinary.com/abhisheksaha/image/upload/o_98/v1713015109/lp_assets/toc_nvf5fj.webp"
          alt="Letterpad Table of contents"
          className="w-full rounded-lg md:rounded-xl"
          loading="lazy"
          style={{
            boxShadow: "rgb(130 66 255) 0px 0px 40rem -3rem",
            border: "1px solid rgba(77,47,86,0.3)",
          }}
          data-aos="fade-down"
          data-aos-delay="400"
        />
      </div>
    </>
  );
};
