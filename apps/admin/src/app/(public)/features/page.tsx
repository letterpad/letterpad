import { BsMagic } from "react-icons/bs";
import { IoAnalytics } from "react-icons/io5";
import { RiAdvertisementLine } from "react-icons/ri";
import { TbFileTextAi, TbSeo, TbTools } from "react-icons/tb";

import { HeroText } from "./hero-text";
import { Mark } from "./mark";
import { Row } from "./row";
import { Block } from "../../../components/get-pro-modal-provider/content";
/**
 * v0 by Vercel.
 * @see https://v0.dev/t/6DL7SoyZYYG
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
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
                    <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800 dark:text-gray-100">
                      New Features
                    </div>
                    <HeroText />
                    <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400 font-paragraph">
                      With Pro, you can get your own domain, enable{" "}
                      <Mark>2x</Mark> earnings, get advanced analytics, AI
                      powered publishing and much more.
                    </p>
                  </div>
                </div>
                <div className="mt-16 lg:mt-32 flex items-center justify-center mx-auto max-w-5xl">
                  <div className="md:grid hidden md:grid-cols-2 lg:grid-cols-3 gap-4 py-12 mt-16">
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
                      icon={<IoAnalytics size={24} className="text-blue-500" />}
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
                <Row
                  imgAlt="Create an outline of your post with AI"
                  title={
                    <>
                      Create an outline of your post with <Mark>AI</Mark>
                    </>
                  }
                  caption="Tell the name of your article and the AI will
                        create an outline to give you an idea of the flow of the
                        post."
                  imgSrc="https://res.cloudinary.com/abhisheksaha/video/upload/c_crop,g_north,h_580,w_916/v1712694116/0402_rni40q.mp4"
                />
                <Row
                  imgAlt="Format your post"
                  reverse={true}
                  title={
                    <>
                      Format your post with <Mark>AI</Mark>
                    </>
                  }
                  caption="Ask the Letterpad AI to format the post and add headlines if you want them to. Or instruct it as per your needs."
                  imgSrc="https://res.cloudinary.com/abhisheksaha/video/upload/c_crop,g_south,h_580,w_916/v1712699444/text-formating_d2pyix.mp4"
                />
                <Row
                  imgAlt="Change the tone"
                  title={<>Change the tone of your post</>}
                  caption="Choose a preset to change the tone or style of your article. You can also simplify the language or execute various assistive options."
                  imgSrc="https://res.cloudinary.com/abhisheksaha/video/upload/c_crop,g_center,h_580,w_916/v1712700823/formatting-variations_ulsill.mp4"
                />
                <Row
                  reverse={true}
                  imgAlt="Let AI handle the tags and excerpts"
                  title={<>Let AI handle the tags and excerpts</>}
                  caption="Focus more on your story. Let Letterpad AI handle the others. You can always edit them later."
                  imgSrc="https://res.cloudinary.com/abhisheksaha/video/upload/c_crop,g_center,h_580,w_1117/v1712701914/tags_excerpt_wukwuq.mp4"
                />
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
