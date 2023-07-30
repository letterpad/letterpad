import React from "react";

import FeaturesImage from "/public/website/features.svg";

function Features() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div className="pb-12 text-center md:pb-20">
            <h2 className="h2 font-uncut-sans" data-aos="zoom-out">
              Elevate your content creation
            </h2>
          </div>
          {/*<div className="pb-16" data-aos="zoom-out">
            <img src={FeaturesImage} width="1104" height="512" alt="Features" />
  </div>*/}
          {/* Items */}
          <div className="mx-auto grid max-w-sm items-start gap-8 md:max-w-none md:grid-cols-3 lg:gap-16">
            {/* 1st item */}
            <div className="flex flex-col items-center" data-aos="zoom-out">
              <div className="mb-4">
                <svg
                  width="56"
                  height="56"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                >
                  <defs>
                    <radialGradient
                      cx="50%"
                      cy="89.845%"
                      fx="50%"
                      fy="89.845%"
                      r="89.85%"
                      id="icon1-b"
                    >
                      <stop stopColor="#3B82F6" stopOpacity=".64" offset="0%" />
                      <stop
                        stopColor="#F472B6"
                        stopOpacity=".876"
                        offset="100%"
                      />
                    </radialGradient>
                    <circle id="icon1-a" cx="28" cy="28" r="28" />
                  </defs>
                  <g fill="none" fillRule="evenodd">
                    <use fill="url(#icon1-b)" xlinkHref="#icon1-a" />
                    <g stroke="#FDF2F8" strokeLinecap="square" strokeWidth="2">
                      <path d="M17 28h22" opacity=".64" />
                      <path d="M20 23v-3h3M33 20h3v3M36 33v3h-3M23 36h-3v-3" />
                    </g>
                  </g>
                </svg>
              </div>
              <h4 className="h4 mb-2 text-center text-gray-200">
                Customization
              </h4>
              <p className="text-center text-md text-gray-400">
                Easily customize the appearance of your blog to match your
                personal style and branding.
              </p>
            </div>
            {/* 2nd item */}
            <div
              className="flex flex-col items-center"
              data-aos="zoom-out"
              data-aos-delay="200"
            >
              <div className="mb-4">
                <svg
                  width="56"
                  height="56"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                >
                  <defs>
                    <radialGradient
                      cx="50%"
                      cy="89.845%"
                      fx="50%"
                      fy="89.845%"
                      r="89.85%"
                      id="icon2-b"
                    >
                      <stop stopColor="#3B82F6" stopOpacity=".64" offset="0%" />
                      <stop
                        stopColor="#F472B6"
                        stopOpacity=".876"
                        offset="100%"
                      />
                    </radialGradient>
                    <circle id="icon2-a" cx="28" cy="28" r="28" />
                  </defs>
                  <g fill="none" fillRule="evenodd">
                    <use fill="url(#icon2-b)" xlinkHref="#icon2-a" />
                    <g stroke="#FDF2F8" strokeLinecap="square" strokeWidth="2">
                      <path d="m18 31 4 4 12-15" />
                      <path d="M39 25h-3M39 30h-7M39 35H28" opacity=".64" />
                    </g>
                  </g>
                </svg>
              </div>
              <h4 className="h4 mb-2 text-center text-gray-200">
                Easy-to-use editor
              </h4>
              <p className="text-center text-md text-gray-400">
                Our content editor is intuitive and user-friendly, allowing you
                to easily create and publish content.
              </p>
            </div>
            {/* 3rd item */}
            <div
              className="flex flex-col items-center"
              data-aos="zoom-out"
              data-aos-delay="400"
            >
              <div className="mb-4">
                <svg
                  width="56"
                  height="56"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                >
                  <defs>
                    <radialGradient
                      cx="50%"
                      cy="89.845%"
                      fx="50%"
                      fy="89.845%"
                      r="89.85%"
                      id="icon3-b"
                    >
                      <stop stopColor="#3B82F6" stopOpacity=".64" offset="0%" />
                      <stop
                        stopColor="#F472B6"
                        stopOpacity=".876"
                        offset="100%"
                      />
                    </radialGradient>
                    <circle id="icon3-a" cx="28" cy="28" r="28" />
                  </defs>
                  <g fill="none" fillRule="evenodd">
                    <use fill="url(#icon3-b)" xlinkHref="#icon3-a" />

                    <g stroke="#FDF2F8" strokeLinecap="square" strokeWidth="2">
                      <path d="m22 24-4 4 4 4M34 24l4 4-4 4" />
                      <path d="m26 36 4-16" opacity=".64" />
                    </g>
                  </g>
                </svg>
              </div>
              <h4 className="h4 mb-2 text-center text-gray-200">
                Custom domains
              </h4>
              <p className="text-center text-md text-gray-400">
                Use your own custom domain name for your blog, rather than a
                subdomain on the blogging platform's domain.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;
