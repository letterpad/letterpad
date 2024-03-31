"use client";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { LuCookie } from "react-icons/lu";

export const CookieBanner = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const cookie = localStorage.getItem("cookie-concent");
    if (!cookie) {
      setShow(true);
    }
  }, []);

  const onClose = () => {
    localStorage.setItem("cookie-concent", "true");
    setShow(false);
  };

  if (!show) return null;
  return (
    <section className="md:px-10 fixed  mx-auto bottom-10 z-20">
      <div className="max-w-xl px-8 py-8 mx-auto flex md:items-center md:gap-x-6 bg-gray-100 dark:bg-slate-800 rounded-lg border dark:border-gray-700 border-gray-200">
        <div className="flex items-start md:items-center gap-x-2">
          <LuCookie size={40} className="fill-blue-500" />
          <p className="text-gray-700 dark:text-gray-200">
            We use cookies to enhance your user experience. By continuing to
            visit this site you agree to{" "}
            <a
              href="#"
              className="underline transition-colors duration-200 hover:text-blue-500 "
            >
              our use of cookies
            </a>
            .
          </p>
        </div>
        <div>
          <button
            onClick={onClose}
            data-testid="close-cookie-banner"
            className="items-center justify-center text-gray-700 transition-colors duration-300 rounded-full flex dark:text-gray-200 dark:hover:bg-gray-700 w-7 h-7 focus:outline-none hover:bg-gray-200"
          >
            <IoMdClose size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};
