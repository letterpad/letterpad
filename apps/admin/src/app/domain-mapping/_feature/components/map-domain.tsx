import { CopyToClipboard } from "@/components/clipboard";

export const MapDomain: React.FC<{
  domain: string;
  validate: JSX.Element;
}> = ({ validate }) => {
  return (
    <div>
      Please add the below A record in your Domain under DNS configuration to
      map your domain with Letterpad
      <div
        className="mt-4 flex items-center justify-between gap-4 rounded-md bg-gray-200 p-4 font-medium text-gray-800
             shadow-sm dark:bg-gray-800  dark:text-gray-400"
      >
        <div className="flex items-center gap-8">
          <div className="flex flex-col gap-4">
            <span className="font-bold text-black dark:text-white">Type</span>
            <code className="text-sm">A</code>
          </div>
          <div className="flex flex-col gap-4">
            <span className="font-bold text-black dark:text-white">Name</span>
            <code className="text-sm">@</code>
          </div>
          <div className="flex flex-col gap-4">
            <span className="font-bold text-black dark:text-white">Value</span>
            <code className="text-sm" id="txt">
              76.76.21.21
            </code>
          </div>
        </div>
        <CopyToClipboard elementId="txt" />
      </div>
      {validate}
    </div>
  );
};
