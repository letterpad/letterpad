import { DomainVerification } from "@/__generated__/__types__";

import { CopyToClipboard } from "../clipboard";

export const VerifyDomain: React.FC<{
  verification?: DomainVerification;
  validate: JSX.Element;
}> = ({ verification, validate }) => {
  if (!verification) return null;
  return (
    <div>
      Please add the below TXT record in your Domain under DNS configuration
      <div
        className="mt-4 flex items-center gap-4 rounded-md bg-gray-200 p-4 font-medium text-gray-800 shadow-sm
             dark:bg-gray-800 dark:text-gray-400"
      >
        <div className="flex flex-col gap-4">
          <span className="font-bold text-black dark:text-white">Type</span>
          <code className="text-sm">TXT</code>
        </div>
        <div className="flex flex-col gap-4">
          <span className="font-bold text-black dark:text-white">Name</span>
          <code className="text-sm">{verification.domain.split(".")[0]}</code>
        </div>
        <div className="flex flex-col gap-4">
          <span className="font-bold text-black dark:text-white">Value</span>
          <code className="text-sm" id="txt">
            {verification.value}
          </code>
        </div>
        <CopyToClipboard elementId="txt" />
      </div>
      {validate}
    </div>
  );
};
