import { Domain } from "@/__generated__/__types__";

export const MappedDomain: React.FC<Domain> = ({ name }) => {
  return (
    <div>
      <div
        className="flex flex-col gap-4 rounded-md  border p-4 font-medium
              text-gray-800  dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
      >
        <h2 className="flex items-center gap-1 text-lg dark:text-gray-200">
          {name}
          <span className="mr-2 rounded-full bg-blue-200 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-700 dark:text-blue-200">
            Production
          </span>
        </h2>

        <div className="rounded-md border p-2 dark:border-gray-700">
          Good news! Your DNS records are set up correctly, but it can take some
          time for them to propagate globally.
        </div>
      </div>
    </div>
  );
};
