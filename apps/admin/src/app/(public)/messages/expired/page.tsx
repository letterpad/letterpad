export const metadata = {
  title: "Letterpad - Verification Expired",
};

import { BiSad } from "react-icons/bi";
import { BsArrowRight } from "react-icons/bs";
import { CiWarning } from "react-icons/ci";
import { Button } from "ui/isomorphic";

export default function Expired() {
  return (
    <form action="/">
      <div className="flex flex-col h-full items-center justify-center  bg-gray-50 dark:bg-gray-900 px-4 md:px-6">
        <div className="max-w-lg w-full space-y-6 text-center">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-50">
            <BiSad className="mr-2 inline-block h-8 w-8 text-primary" />
            Link Expired!
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            <CiWarning className="mr-2 inline-block h-6 w-6 text-primary" />
            The token in the link has expired. Please retry to get a new link or
            contact us at help@letterpad.app
          </p>
          <div className="relative">
            <Button className="w-full" type="submit">
              <BsArrowRight className="mr-2 inline-block h-5 w-5" />
              Proceed to Home
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
