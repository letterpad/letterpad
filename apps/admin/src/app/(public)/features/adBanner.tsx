import { CustomLink } from "./components";

export const AdBanner = () => {
  return (
    <div
      className="w-full items-center lg:px-24 max-w-7xl md:px-12 mx-auto px-8 py-12 relative rounded-lg"
      style={{
        background: "linear-gradient(45deg, #1a327e75, #1b1a41d6)",
      }}
    >
      <div className="bg-gradient absolute w-full h-full top-0 left-0" />

      <div className="relative items-center flex">
        <div className="w-full justify-between lg:inline-flex lg:items-center">
          <div className="max-w-xl">
            <span className="text-sm dark:text-white text-white  font-semibold uppercase tracking-widest">
              Letterpad
            </span>
            <p className="font-bold font-paragraph mt-8 text-3xl tracking-tight dark:text-white/80 text-slate-200 ">
              Get started in seconds. Join our community of writers.
              {/* <span className="lg:block">make a move!</span> */}
            </p>
          </div>
          <div className="flex flex-row lg:ml-auto mt-12 sm:flex-row">
            <CustomLink href={`/register?ref=features-banner-cta`}>
              Get started now &nbsp;&nbsp;
              <span className="font-bold text-2xl">→</span>
            </CustomLink>
          </div>
        </div>
      </div>
    </div>
  );
};
