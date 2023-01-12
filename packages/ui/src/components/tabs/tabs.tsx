import classNames from "classnames";
import { Children, FC, useState } from "react";

interface Props {
  data: [{ name: string; content }];
  children: (data: { name: string; content }) => JSX.Element;
}
export const Tabs: FC<any> = ({ children, active, onClick }) => {
  const [activeTab, setActiveTab] = useState(active);

  const onClickTabItem = (tab) => {
    setActiveTab(tab);
    onClick(tab);
  };

  return (
    <>
      <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
        <ul className="-mb-px flex flex-wrap text-center text-sm font-medium">
          {Children.map(children, (child, index) => {
            const { label, id } = child.props;

            return (
              <Header
                activeTab={activeTab}
                id={id}
                key={id}
                label={label}
                onClick={onClickTabItem}
              />
            );
          })}
        </ul>
      </div>
      <div
        className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800"
        role="tabpanel"
      >
        {Children.map(children, (child, index) => {
          if (child.props.id !== activeTab) return undefined;
          return child.props.children;
        })}
      </div>
    </>
  );
};
const Header = ({ activeTab, label, onClick, id }) => {
  return (
    <li className="mr-2" role="presentation">
      <button
        onClick={() => onClick(id)}
        className={classNames("inline-block rounded-t-lg border-b-2 p-4", {
          "border-gray-100 text-gray-500 hover:border-gray-300 hover:text-gray-600 dark:border-transparent dark:border-gray-700 dark:text-gray-300 dark:hover:text-gray-300":
            activeTab !== id,
          "border-blue-600 text-blue-600 hover:text-blue-600 dark:border-blue-500 dark:text-blue-500 dark:hover:text-blue-500":
            activeTab === id,
        })}
        role="tab"
        aria-selected="false"
      >
        {label}
      </button>
    </li>
  );
};

export const Tab = ({ children, label, id }) => {
  return <>{children}</>;
};
