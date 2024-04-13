"use client";

import classNames from "classnames";
import { FC, useEffect, useRef } from "react";
import { useIntersectionObserver } from "ui";

import { Heading } from "./headings";

interface Props {
  title: string;
  caption: string;
  imgSrc: string;
  reverse?: boolean;
  imgAlt: string;
  tag?: string;
  imgClass?: string;
}
export const Row: FC<Props> = ({
  title,
  caption,
  imgSrc,
  reverse = false,
  tag,
  imgClass,
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
          data-aos={"fade-down"}
          data-aos-delay="200"
        >
          <span className="bg-purple-100 text-purple-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-purple-900 dark:text-purple-300">
            {tag}
          </span>
          <div className="grid gap-2">
            <Heading
              title={title}
              description={caption}
              size="sm"
              className="text-center md:text-left"
            />
          </div>
        </div>
        <div className="flex flex-col lg:p-10 sm:ml-0 sm:mr-0">
          <div
            className="w-screen md:w-[36rem] rounded-lg md:rounded-xl px-4"
            data-aos={"fade-down"}
            data-aos-delay="200"
          >
            <div className="absolute top-0 left-0 bg-gradient w-full h-full opacity-40" />
            <img
              src={imgSrc}
              className={
                "w-full h-full object-fit rounded-lg md:rounded-xl border-opacity-10 border border-purple-500 " +
                imgClass
              }
              alt="generate_title"
              style={{
                boxShadow: "rgb(130 66 255) 0px 0px 40rem -3rem",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
