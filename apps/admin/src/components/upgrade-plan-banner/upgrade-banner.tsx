import { BsInfoCircleFill } from "react-icons/bs";

import { isMembershipFeatureActive } from "../../shared/utils";

export const UpgradeBanner = () => {
  const membershipFeatureActive = isMembershipFeatureActive();
  if (!membershipFeatureActive) return null;

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
        <button
          type="button"
          className="text-white bg-blue-800 hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-200 font-medium rounded-lg text-xs px-3 py-1.5 me-2 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Upgrade Now
        </button>
        <button
          type="button"
          className="text-blue-800 bg-transparent border border-blue-800 hover:bg-blue-900 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-200 font-medium rounded-lg text-xs px-3 py-1.5 text-center dark:hover:bg-blue-600 dark:border-blue-600 dark:text-blue-400 dark:hover:text-white dark:focus:ring-blue-800"
          data-dismiss-target="#alert-additional-content-1"
          aria-label="Close"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};
