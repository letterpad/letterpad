"use client";

import classNames from "classnames";
import { FC, useEffect, useRef } from "react";
import { useIntersectionObserver } from "ui";

import { Heading } from "./headings";
import VideoPlayer from "../../../components/video/video";

interface Props {
  title: string;
  caption: string;
  imgSrc: string;
  reverse?: boolean;
  imgAlt: string;
  tag?: string;
}
export const Row: FC<Props> = ({
  title,
  caption,
  imgSrc,
  reverse = false,
  tag,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isIntersecting, hasLoaded } = useIntersectionObserver(videoRef, {
    rootMargin: "0px",
  });

  useEffect(() => {
    if (isIntersecting && !hasLoaded) {
      videoRef.current?.play();
    }
  }, [hasLoaded, isIntersecting]);

  useEffect(() => {
    videoRef.current?.addEventListener("mouseover", () => {
      videoRef.current?.pause();
    });
    videoRef.current?.addEventListener("mouseout", () => {
      videoRef.current?.play();
    });

    const video = videoRef.current;
    return () => {
      video?.removeEventListener("mouseover", () => {
        video?.pause();
      });
      video?.removeEventListener("mouseout", () => {
        video?.play();
      });
    };
  }, []);

  const videoJsOptions = {
    sources: [
      {
        src: imgSrc,
        type: "video/mp4",
      },
    ],
  };

  return (
    <div>
      <div
        className={classNames(
          "flex flex-col lg:flex-row  gap-10 items-center",
          {
            "lg:flex-row-reverse": reverse,
          }
        )}
      >
        <div
          className="flex flex-col text-center md:text-left items-center lg:items-start space-y-4 w-full md:max-w-96"
          data-aos={reverse ? "fade-left" : "fade-right"}
          data-aos-delay="200"
        >
          <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800 dark:text-gray-100">
            {tag}
          </div>
          <div className="grid gap-2">
            <Heading
              title={title}
              description={caption}
              size="sm"
              className="text-center md:text-left"
            />
          </div>
        </div>
        <div className="flex flex-col lg:p-10  -ml-11 -mr-11 sm:ml-0 sm:mr-0">
          <div
            className="w-screen md:w-[36rem] rounded-lg"
            data-aos={reverse ? "fade-right" : "fade-left"}
            data-aos-delay="200"
          >
            <VideoPlayer
              options={{
                ...videoJsOptions,
                poster:
                  "https://res.cloudinary.com/abhisheksaha/image/upload/c_scale,w_936/v1712854446/lp_assets/Untitled-3_us4npl.avif",
              }}
              // onReady={() => console.log("The video is ready to play")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
