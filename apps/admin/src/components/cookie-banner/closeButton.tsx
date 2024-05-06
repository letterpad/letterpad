"use client";

import { IoMdClose } from "@react-icons/all-files/io/IoMdClose";

import { onClose } from "./action";

export const CloseButton = () => {
  return (
    <form action={onClose}>
      <button
        aria-label="Close"
        type="submit"
        data-testid="close-cookie-banner"
        className="items-center justify-center text-gray-700 transition-colors duration-300 rounded-full flex dark:text-gray-200 dark:hover:bg-gray-700 w-7 h-7 focus:outline-none hover:bg-gray-200"
      >
        <IoMdClose size={20} />
      </button>
    </form>
  );
};
