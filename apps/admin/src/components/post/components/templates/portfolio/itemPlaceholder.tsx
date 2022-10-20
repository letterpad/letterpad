import { useState } from "react";

import ImageUpload from "@/components/ImageUpload";

export const ItemPlaceholder = ({
  className,
  removeItem,
  description,
  onSave,
  src,
}) => {
  const [text, setText] = useState(description);
  const [image, setImage] = useState(src);
  return (
    <div
      className={`flex flex-row items-center space-y-2 md:space-x-12 ${className}`}
    >
      <div className="m-10 h-[calc(50vh)]  w-3/5 border border-indigo-600">
        <ImageUpload
          name="Logo"
          url={src}
          onDone={([res]) => {
            onSave({ description: text, src: res.src });
            setImage(res.src);
          }}
        />
      </div>
      <div className="flex-1">
        <textarea
          id="message"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          className="block w-full rounded-md border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900  dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 "
          placeholder="Your message..."
        ></textarea>
        <br />
        <div>
          <button
            className="top-0 mr-2 mb-2 rounded-sm bg-red-700 p-2 text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
            onClick={() => onSave({ description: text, src: image })}
          >
            Save
          </button>
          <button
            className="top-0 mr-2 mb-2 rounded-sm bg-red-700 p-2 text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
            onClick={removeItem}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
