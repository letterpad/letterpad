import Apollo from "/public/website/logos/apollo.svg";
import Graphql from "/public/website/logos/graphql.svg";
import Nextjs from "/public/website/logos/nextjs.svg";
import Prisma from "/public/website/logos/prisma.svg";
import Tailwind from "/public/website/logos/tailwind.svg";
import Tinymce from "/public/website/logos/tinymce.svg";

function PressLogos() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="border-b border-gray-800 py-6">
          <div className="mx-auto grid max-w-sm grid-cols-3 gap-2 md:max-w-6xl">
            <div
              className="col-auto flex items-center justify-center py-2"
              data-aos="zoom-out"
            >
              <img src={Nextjs.src} width={70} alt="Nextjs" />
            </div>
            <div
              className="col-auto flex items-center justify-center py-2"
              data-aos="zoom-out"
              data-aos-delay="400"
            >
              <img src={Tailwind.src} width={110} alt="Tailwind" />
            </div>
            <div
              className="col-auto flex items-center justify-center py-2"
              data-aos="zoom-out"
              data-aos-delay="100"
            >
              <img src={Prisma.src} width={70} alt="Prisma" />
            </div>
            <div
              className="col-auto flex items-center justify-center py-2"
              data-aos="zoom-out"
              data-aos-delay="200"
            >
              <img src={Graphql.src} width={50} alt="Graphql" />
            </div>
            <div
              className="col-auto flex items-center justify-center py-2"
              data-aos="zoom-out"
              data-aos-delay="300"
            >
              <img src={Apollo.src} width={100} alt="Apollo" />
            </div>
            <div
              className="col-auto flex items-center justify-center py-2"
              data-aos="zoom-out"
              data-aos-delay="400"
            >
              <img src={Tinymce.src} width={70} alt="Tinymce" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PressLogos;
