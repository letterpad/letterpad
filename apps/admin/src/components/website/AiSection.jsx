import React from "react";

function AiSection() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          <div className="pb-12 text-center md:pb-20">
            <h2 className="h2 font-uncut-sans" data-aos="zoom-out">
              With Generative AI
            </h2>
            <div className="mx-auto mt-8 max-w-2xl">
              <p className="text-xl text-gray-400">
                Continue your writing with the help of AI. Use +++ to generate
                suggestive text which is based on your writing style.
              </p>
            </div>
          </div>
          <video
            data-cld-font-face="inherit"
            class="vjs-tech"
            tabindex="-1"
            preload="auto"
            controls={true}
            poster="https://res-console.cloudinary.com/abhisheksaha/media_explorer_thumbnails/223914a1195b2b8630fdf76ae5e61f13/detailed"
            src="https://res.cloudinary.com/abhisheksaha/video/upload/v1703412901/eikymzl7nzhqt7dntex9.mp4"
          ></video>
        </div>
      </div>
    </section>
  );
}

export default AiSection;
