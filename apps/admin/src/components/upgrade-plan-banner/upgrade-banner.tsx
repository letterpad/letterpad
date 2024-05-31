"use client";
import Link from "next/link";
import { BsInfoCircleFill } from "react-icons/bs";

import { useIsPaidMember } from "../../hooks/useIsPaidMember";

export const UpgradeBanner = () => {
  const isPaidMember = useIsPaidMember();
  if (isPaidMember) {
    return null;
  }

  return (
    <div
      id="alert-additional-content-1"
      className="p-4 mb-4 text-blue-800 border border-blue-300 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-800"
      role="alert"
    >
      <div className="flex items-center">
        <BsInfoCircleFill className="me-2" />
        <span className="sr-only">Info</span>
        <h3 className="font-bold font-sans">Available to Pro Members</h3>
      </div>
      <div className="mt-2 mb-4 text-sm">
        Unlock this and other potential features of Letterpad by upgrading to
        pro plan.
      </div>
      <div className="flex">
        <Link
          prefetch={false}
          href={"/membership"}
          type="button"
          className="text-white bg-blue-800 hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-200 font-medium rounded-lg text-xs px-3 py-1.5 me-2 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Upgrade Now
        </Link>
      </div>
    </div>
  );
};
