import { Block } from "@/components/get-pro-modal-provider/content";

import { Analytics } from "./analytics";
import { Aos } from "./aos";
import { CustomLink } from "./components";
import { blocks, data } from "./data";
import { Heading } from "./headings";
import { HeroText } from "./hero-text";
import { Mark } from "./mark";
import { Row } from "./row";
import { Toc } from "./toc";

export default function Component() {
  return (
    <>
      <div className="sm:py-18 container relative mx-auto px-6 py-16 md:py-24 lg:px-16 lg:py-24 xl:px-20 pt-8 md:pt-16 overflow-hidden">
        <div className="relative">
          <div className="mx-auto">
            <section className="w-full">
              <div className="container px-4 md:px-6">
                <div className="max-w-5xl mx-auto items-center gap-4 sm:px-6 md:px-10 text-center">
                  <div className="space-y-8">
                    <div
                      data-aos="fade-down"
                      data-aos-easing="linear"
                      data-aos-duration="200"
                      className="inline-block rounded-full bg-blue-500 px-3 py-1 text-sm text-white"
                    >
                      New Features
                    </div>
                    <HeroText />
                    <p
                      data-aos="fade-down"
                      data-aos-easing="linear"
                      data-aos-duration="200"
                      className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400 font-paragraph"
                    >
                      With Pro, you can get your own domain, enable{" "}
                      <Mark>2x</Mark> earnings, get advanced analytics, AI
                      powered publishing and much more.
                    </p>
                  </div>
                  <div className="flex items-center justify-center my-10">
                    <CustomLink href="/register?ref=features-cta">
                      Register
                    </CustomLink>
                  </div>
                </div>
                <div className="space-y-40">
                  <div className="flex items-center justify-center mx-auto max-w-5xl">
                    <div className="md:grid hidden md:grid-cols-2 lg:grid-cols-3 gap-4 py-24 mt-16">
                      {blocks.map((block, index) => (
                        <Block key={index} {...block} />
                      ))}
                    </div>
                  </div>
                  <Analytics />
                  {data.map((row, index) => (
                    <Row key={index} {...row} />
                  ))}
                  <div className="text-center md:px-40">
                    <Toc />
                  </div>
                  <div className="text-center">
                    <Heading
                      title="Get Pro and start publishing with Letterpad AI"
                      description="Unlock premium AI-powered features designed to enhance your writing and make publishing easier."
                    />
                    <div className="mt-10">
                      <CustomLink href="/pricing?ref=features-bottom">
                        Go Pro Today
                      </CustomLink>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      <Aos />
    </>
  );
}
