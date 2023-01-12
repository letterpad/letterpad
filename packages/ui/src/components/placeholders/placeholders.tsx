export const TextBlockPlaceholder = () => {
  return (
    <div role="status" className="w-full animate-pulse space-y-2.5">
      <div className="flex w-full items-center space-x-2">
        <div className="h-2.5 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-600"></div>
        <div className="h-2.5 w-full rounded-full bg-gray-300 dark:bg-gray-600"></div>
      </div>
      <div className="flex w-full max-w-[480px] items-center space-x-2">
        <div className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-2.5 w-full rounded-full bg-gray-300 dark:bg-gray-600"></div>
        <div className="h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-600"></div>
      </div>
      <div className="flex w-full items-center space-x-2">
        <div className="h-2.5 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-600"></div>
        <div className="h-2.5 w-3/5 rounded-full bg-gray-300 dark:bg-gray-600"></div>
      </div>
      <div className="flex w-full items-center space-x-2">
        <div className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-600"></div>
        <div className="h-2.5 w-full rounded-full bg-gray-300 dark:bg-gray-600"></div>
        <div className="h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-600"></div>
      </div>
      <div className="flex w-full items-center space-x-2">
        <div className="h-2.5 w-32 rounded-full bg-gray-300 dark:bg-gray-600"></div>
        <div className="h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-600"></div>
        <div className="h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-600"></div>
        <div className="h-2.5 w-3/5 rounded-full bg-gray-300 dark:bg-gray-600"></div>
      </div>
      <div className="flex w-full max-w-[360px] items-center space-x-2">
        <div className="h-2.5 w-full rounded-full bg-gray-300 dark:bg-gray-600"></div>
        <div className="h-2.5 w-80 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-2.5 w-full rounded-full bg-gray-300 dark:bg-gray-600"></div>
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export const LinePlaceholder = () => {
  return (
    <div role="status" className=" animate-pulse ">
      <div className="mt-4 flex h-8 items-center justify-center gap-2">
        <div className="h-2 w-20 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-2 w-24 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="w-18 h-2 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-2 w-24 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-2 w-24 rounded-full bg-gray-200 dark:bg-gray-700"></div>
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export const PostTitlePlaceholder = () => {
  return (
    <div role="status" className=" animate-pulse ">
      <div className="flex h-10 items-center justify-center gap-2">
        <div className="h-8 w-20 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-8 w-24 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-8 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-8 w-1/3 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-8 w-24 rounded-full bg-gray-200 dark:bg-gray-700"></div>
      </div>
      <div className="flex h-10 items-center justify-center gap-2">
        <div className="h-8 w-28 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-8 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="w-18 h-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-8 w-24 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-8 w-24 rounded-full bg-gray-200 dark:bg-gray-700"></div>
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};
