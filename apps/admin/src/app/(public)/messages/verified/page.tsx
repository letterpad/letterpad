export const metadata = {
  title: "Letterpad - Email Verified",
};

import { BsArrowRight } from "react-icons/bs";
import { MdOutlineEmail } from "react-icons/md";
import { RiVerifiedBadgeLine } from "react-icons/ri";
import { Button } from "ui/isomorphic";

export default function Verified() {
  return (
    <form action="/api/auth/signin">
      <div className="flex flex-col h-full items-center justify-center  bg-gray-50 dark:bg-gray-900 px-4 md:px-6">
        <div className="max-w-md w-full space-y-6 text-center">
          <h1 className="md:text-4xl text-xl font-bold text-gray-900 dark:text-gray-50">
            <RiVerifiedBadgeLine className="mr-2 inline-block h-8 w-8 text-primary" />
            Email Verified!
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            <MdOutlineEmail className="mr-2 inline-block h-6 w-6 text-primary" />
            Your email has been successfully verified with Letterpad.
          </p>
          <div className="relative">
            <Button className="w-full" type="submit" variant={"success"}>
              <BsArrowRight className="mr-2 inline-block h-5 w-5" />
              Proceed to Login
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

Verified.isMessage = true;
