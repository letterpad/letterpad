import Link from "next/link";
import { BsMagic } from "react-icons/bs";
import { IoAnalytics } from "react-icons/io5";
import { RiAdvertisementLine } from "react-icons/ri";
import { TbFileTextAi, TbSeo, TbTools } from "react-icons/tb";

import { Analytics } from "./analytics";
import { Aos } from "./aos";
import { Heading } from "./headings";
import { HeroText } from "./hero-text";
import { Mark } from "./mark";
import { Row } from "./row";
import { Block } from "../../../components/get-pro-modal-provider/content";

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
                  <div className="flex items-center justify-center">
                    <CustomLink href="/register?ref=features-cta">
                      Register
                    </CustomLink>
                  </div>
                </div>
                <div className="space-y-40">
                  <div className="flex items-center justify-center mx-auto max-w-5xl">
                    <div className="md:grid hidden md:grid-cols-2 lg:grid-cols-3 gap-4 py-24 mt-16">
                      <Block
                        title="Inline AI Text editing"
                        description="Turn a selected paragraph into one sentence or bullets, rephrase
        it for clarify, or modify its tone."
                        icon={<BsMagic size={24} className="text-blue-500" />}
                      />
                      <Block
                        title="Context-aware AI chatbot"
                        description="Improve your opening paragraph, use better adjectives, and
        simplify complex topics - all in one place."
                        icon={
                          <TbFileTextAi size={24} className="text-blue-500" />
                        }
                      />
                      <Block
                        title="Creative Tools"
                        description="Generate Table of Contents, Summarize your article, and more."
                        icon={<TbTools size={24} className="text-blue-500" />}
                      />
                      <Block
                        title="One-click SEO assistant"
                        description="Generate post titles and meta tags automatically to rank higher in search results."
                        icon={<TbSeo size={24} className="text-blue-500" />}
                      />
                      <Block
                        title="Advanced Analytics"
                        description="Get insights to your posts with the advanced analytics."
                        icon={
                          <IoAnalytics size={24} className="text-blue-500" />
                        }
                      />
                      <Block
                        title="No Ads"
                        description="We do not show ads on your blog. We rely on your subscription in exchange of creative tools."
                        icon={
                          <RiAdvertisementLine
                            size={24}
                            className="text-blue-500"
                          />
                        }
                      />
                    </div>
                  </div>
                  <Analytics />
                  <Row
                    tag="Effortless Outlining"
                    imgAlt="Generate post outlines effortlessly"
                    title={"Generate post outlines effortlessly"}
                    caption="Simply provide the article name and let AI create an outline, guiding your writing process."
                    imgSrc="https://res.cloudinary.com/abhisheksaha/video/upload/v1712828356/videos/outline_h63myb.mp4"
                  />
                  <Row
                    tag="Smart Formatting"
                    imgAlt="Automate post formatting"
                    reverse={true}
                    title={"Automate post formatting"}
                    caption="Direct Letterpad AI to format your post, including adding headlines, or tailor it to your specifications."
                    imgSrc="https://res.cloudinary.com/abhisheksaha/video/upload/v1712828361/videos/format_vzs8x2.mp4"
                  />
                  <Row
                    tag="Tailored Expression"
                    imgAlt="Customize post tone"
                    title={"Customize the tone of your post"}
                    caption="Select a preset to adjust the tone or style of your article. You can also simplify language or utilize other helpful options."
                    imgSrc="https://res.cloudinary.com/abhisheksaha/video/upload/v1712829765/videos/tone_frm4uc.mp4"
                  />
                  <Row
                    tag="Streamlined Management"
                    reverse={true}
                    imgAlt="Streamline tagging and excerpts"
                    title={"Streamline tagging and excerpts with AI"}
                    caption="Focus on your narrative while Letterpad AI manages the rest. You can always refine them later."
                    imgSrc="https://res.cloudinary.com/abhisheksaha/video/upload/v1712830514/videos/tags_hftbzp.mp4"
                  />
                  <div className="text-center md:px-40">
                    <Heading
                      title="Generate Table of Contents"
                      description="Generate Table of Contents with one click. Make your
                      articles more readable and SEO friendly."
                    />
                    <div className="relative w-full">
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient"></div>
                      <img
                        src="https://res.cloudinary.com/abhisheksaha/image/upload/c_scale,w_1100/v1712833150/lp_assets/frame_generic_dark_3_wks1az.avif"
                        alt="Letterpad Table of contents"
                        className="w-full mt-10 md:rounded-lg"
                        loading="lazy"
                        style={{
                          boxShadow: "rgb(130 66 255) 0px 0px 40rem -3rem",
                        }}
                        data-aos="zoom-in"
                        data-aos-delay="600"
                      />
                    </div>
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

const CustomLink = ({ href, children }) => {
  return (
    <Link
      href={href}
      data-aos="zoom-in"
      data-aos-delay="200"
      className="my-10 py-2.5 px-5 me-2 mb-2 text-sm font-medium text-white bg-black rounded-lg"
    >
      {children}
    </Link>
  );
};
