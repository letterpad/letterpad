export const metadata = {
  title: "Letterpad - Unsubscribed successfully",
};

import { BsArrowRight } from "react-icons/bs";
import { RiVerifiedBadgeLine } from "react-icons/ri";
import { VscDebugDisconnect } from "react-icons/vsc";
import { Button } from "ui/isomorphic";

export default function Unsubscribed({ searchParams }) {
  const msg =
    searchParams?.msg || "Your email has been removed from our system";
  return (
    <form action="/">
      <div className="flex flex-col h-full items-center justify-center  bg-gray-50 dark:bg-gray-900 px-4 md:px-6">
        <div className="max-w-md w-full space-y-6 text-center">
          <h1 className="text-4xl font-['Playfair Display'] font-bold text-gray-900 dark:text-gray-50">
            <RiVerifiedBadgeLine className="mr-2 inline-block h-8 w-8 text-primary" />
            Unsubscribed!
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            <VscDebugDisconnect className="mr-2 inline-block h-6 w-6 text-primary" />
            {msg}
          </p>
          <div className="relative">
            <Button className="w-full" type="submit" variant={"success"}>
              <BsArrowRight className="mr-2 inline-block h-5 w-5" />
              Proceed to Home
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

Unsubscribed.isMessage = true;
