import { IoInformationCircle } from "react-icons/io5";

import { Content } from "@/components_v2/content";

const ErrorMessage = ({ title, description }) => {
  return (
    <Content>
      <div
        id="alert-2"
        className="mb-4 flex rounded-lg bg-red-100 p-4 dark:bg-red-200"
        role="alert"
      >
        <IoInformationCircle className="text-red-500" size={24} />
        <span className="sr-only">Info</span>
        <div className="flex flex-col gap-2">
          <div className="ml-3 text-base font-medium text-red-700 dark:text-red-800">
            {title}
          </div>
          {description && (
            <div className="ml-3 text-md text-red-700 dark:text-red-800">
              {description}
            </div>
          )}
        </div>
      </div>
    </Content>
  );
};

export default ErrorMessage;
