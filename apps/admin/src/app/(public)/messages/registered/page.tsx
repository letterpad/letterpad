export const metadata = {
  title: "Letterpad - Email Verified",
};

import { BiRocket } from "react-icons/bi";
import { BsArrowRight } from "react-icons/bs";
import { IoSparkles } from "react-icons/io5";
import { Button } from "ui/dist/isomorphic.mjs";

export default function Registered() {
  return (
    <form action="/api/auth/signin">
      <div className="flex flex-col h-full items-center justify-center  bg-gray-50 dark:bg-gray-900 px-4 md:px-6">
        <div className="max-w-md w-full space-y-6 text-center">
          <h1 className="md:text-4xl text-xl font-bold text-gray-900 dark:text-gray-50">
            <BiRocket className="mr-2 inline-block h-8 w-8 text-primary" />
            Welcome Aboard!
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            <IoSparkles className="mr-2 inline-block h-6 w-6 text-primary" />
            You have been registered successfully. We have sent you an email to
            verify your email address.
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

Registered.isMessage = true;
