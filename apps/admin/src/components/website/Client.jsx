import React from "react";

import FeaturesImage from "/public/website/theme-1.png";

function Client() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div className="pb-12 text-center md:pb-20">
            <h2 className="h2 mb-4 font-uncut-sans" data-aos="zoom-out">
              A light weight website
            </h2>
            <div className="mx-auto max-w-2xl">
              <p className="text-xl text-gray-400">
                We have also designed the website to be lightweight and is
                powered by GraphQL. By using modern web technologies and best
                practices, we are able to deliver a fast and responsive website
                that loads quickly and efficiently, even on slower connections.
              </p>
            </div>
          </div>

          <div className="pb-16 md:px-20" data-aos="zoom-out">
            <img
              src={FeaturesImage.src}
              width="1104"
              height="512"
              alt="Features"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Client;
