// import FeaturesImage from '../images/features-02.png';
import FeaturesImage from "/public/website/dashboard-3.png";
import Illustration from "/public/website/features-illustration.svg";

function Features02() {
  return (
    <section className="relative">
      {/* Bg gradient */}
      <div
        className="pointer-events-none absolute left-0 right-0 top-0 -z-10 h-[10rem] bg-gradient-to-b from-gray-800 to-gray-900 opacity-60"
        aria-hidden="true"
      />
      {/* Bg illustration */}
      <div
        className="absolute left-1/2 top-0 -z-10 ml-[390px]"
        aria-hidden="true"
      >
        <img
          src={Illustration.src}
          className="max-w-none"
          width="608"
          height="305"
          alt="Illustration"
        />
      </div>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div className="mx-auto max-w-3xl pb-12 text-center md:pb-20">
            <h2 className="h2 mb-4 font-uncut-sans">
              Delivers ridiculous speed and performance
            </h2>
            <div className="mx-auto max-w-2xl">
              <p className="text-xl text-gray-400">
                Letterpad is a highly performant blogging platform that runs at
                lightning speed, making it a great choice for users who want a
                smooth and seamless experience..
              </p>
            </div>
          </div>
          {/* Section content */}
          <div className="xl:space-x-18 mx-auto flex max-w-xl flex-col space-y-8 space-y-reverse md:max-w-none md:flex-row md:items-center md:space-x-8 md:space-y-0 lg:space-x-16">
            {/* Content */}
            <div
              className="order-1 md:order-none md:w-7/12 lg:w-1/2"
              data-aos="zoom-out"
              data-aos-delay="200"
            >
              <div className="text-center md:text-left">
                <h3 className="h3 mb-4 font-uncut-sans text-4xl">Features</h3>
                <p className="mb-6 text-xl text-gray-400">
                  Streamline your blogging process with Letterpad's powerful and
                  convenient features.
                </p>
                <ul className="inline-flex flex-col space-y-3 text-md text-gray-400">
                  <li className="flex items-center">
                    <svg
                      className="mr-3 h-3 w-3 shrink-0 fill-current text-emerald-500"
                      viewBox="0 0 12 12"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
                    </svg>
                    <span>Write photo-stories with Creatives</span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="mr-3 h-3 w-3 shrink-0 fill-current text-emerald-500"
                      viewBox="0 0 12 12"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
                    </svg>
                    <span>Customise layout and brand colors</span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="mr-3 h-3 w-3 shrink-0 fill-current text-emerald-500"
                      viewBox="0 0 12 12"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
                    </svg>
                    <span>Inbuilt Grammarly for spotting mistakes</span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="mr-3 h-3 w-3 shrink-0 fill-current text-emerald-500"
                      viewBox="0 0 12 12"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
                    </svg>
                    <span>CDN and Unsplash integrated for images</span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="mr-3 h-3 w-3 shrink-0 fill-current text-emerald-500"
                      viewBox="0 0 12 12"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
                    </svg>
                    <span>SEO Optimised</span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="mr-3 h-3 w-3 shrink-0 fill-current text-emerald-500"
                      viewBox="0 0 12 12"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
                    </svg>
                    <span>Map your custom domain</span>
                  </li>
                </ul>
              </div>
            </div>
            {/* Image */}
            <div className="md:w-5/12 lg:w-1/2" data-aos="zoom-out">
              <img
                className="mx-auto md:max-w-none"
                src={FeaturesImage.src}
                width="540"
                height="581"
                alt="Features"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features02;
