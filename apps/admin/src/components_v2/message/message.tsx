import classNames from "classnames";
import React, { FC } from "react";
import ReactDom from "react-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  IoIosCheckmarkCircle,
  IoIosCloseCircle,
  IoIosWarning,
} from "react-icons/io";

const DELAY = 2000;

function getTextWidth(text: string, font = null) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return 0;
  context.font = font || getComputedStyle(document.body).font;
  return context.measureText(text).width;
}

export const Message = () => {
  const node = document.querySelector("#message");
  clearText(node, 0);
  return {
    success: ({ content, duration = DELAY }) => {
      ReactDom.render(<MessageMarkup success={true} content={content} />, node);
      clearText(node, duration);
    },
    error: ({ content, duration = DELAY }) => {
      ReactDom.render(<MessageMarkup error={true} content={content} />, node);
      clearText(node, duration);
    },
    warn: ({ content, duration = DELAY }) => {
      ReactDom.render(<MessageMarkup warn={true} content={content} />, node);
      clearText(node, duration);
    },
    loading: ({ content, duration = DELAY }) => {
      ReactDom.render(<MessageMarkup loading={true} content={content} />, node);
      clearText(node, duration);
    },
    destroy: () => {
      ReactDom.render(<span />, node);
    },
  };
};

let timeout;
const clearText = (node, DELAY) => {
  clearTimeout(timeout);
  if (DELAY === 0) return;
  timeout = setTimeout(() => {
    ReactDom.render(<span />, node);
  }, DELAY);
};

interface Props {
  success?: boolean;
  error?: boolean;
  warn?: boolean;
  loading?: boolean;
  content: string;
}
const MessageMarkup: FC<Props> = ({
  success,
  error,
  warn,
  loading,
  content,
}) => {
  const textWidth = getTextWidth(content) + 120;
  const width = Math.min(textWidth, Math.min(window.innerWidth - 100, 500));

  let Icon = IoIosCheckmarkCircle;
  if (error) {
    Icon = IoIosCloseCircle;
  } else if (warn) {
    Icon = IoIosWarning;
  } else if (loading) {
    Icon = AiOutlineLoading3Quarters;
  }
  return (
    <div className="fixed inset-x-0 top-2 z-50 mx-auto" style={{ width }}>
      <div
        className={classNames(
          "text-md my-2 flex w-full items-center  rounded-md p-3 shadow-md",
          {
            "bg-green-200": success,
            "bg-red-200": error,
            "bg-orange-200": warn,
            "bg-gray-200 dark:bg-gray-800": loading,
          },
        )}
      >
        <Icon
          size={18}
          className={classNames("mr-3 font-extrabold ", {
            "text-green-600": success,
            "text-red-600": error,
            "text-orange-600": warn,
            "animate-spin": loading,
            "text-blue-600": loading,
          })}
        />
        <span
          className={classNames("text-base leading-5 ", {
            "text-green-800": success,
            "text-red-800": error,
            "text-orange-800": warn,
            "text-gray-800 dark:text-gray-200": loading,
          })}
        >
          {content}
        </span>
      </div>
    </div>
  );
};
