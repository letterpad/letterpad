import { BiCookie } from "@react-icons/all-files/bi/BiCookie";
import { cookies } from "next/headers";

import { CloseButton } from "./closeButton";
// import { EventAction, EventCategory, EventLabel, track } from "../../track";

export const CookieBanner = () => {
  // const [show, setShow] = useState(false);
  const cookie = cookies();
  const hasConcent = cookie.get("cookie-consent")?.value === "true";
  if (hasConcent) return null;

  return (
    <section className="md:px-10 fixed  mx-auto bottom-10 z-20">
      <div className="max-w-xl px-8 py-8 mx-auto flex md:items-center md:gap-x-6 bg-gray-100 dark:bg-slate-800 rounded-lg border dark:border-gray-700 border-gray-200">
        <div className="flex items-start md:items-center gap-x-2">
          <BiCookie size={40} className="fill-blue-500" />
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
          <CloseButton />
        </div>
      </div>
    </section>
  );
};
