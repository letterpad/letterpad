import classNames from "classnames";
import { Children, useState } from "react";

export const Component = ({ children, activeKey, onChange }) => {
  const [activeTab, setActiveTab] = useState(activeKey);

  const onClickTabItem = (id) => {
    if (id === activeTab) {
      id = "";
    }
    setActiveTab(id);
    onChange(id);
  };
  const totalChildren = Children.count(children);
  return (
    <>
      <div data-accordion="collapse">
        {Children.map(children, (child, index) => {
          const { label, id, children } = child.props;
          const isFirstItem = index === 0;
          const isLastItem = index === totalChildren - 1;

          return (
            <>
              <Header
                isFirstItem={isFirstItem}
                isLastItem={isLastItem}
                key={id}
                isActive={activeTab === id}
                label={label}
                onClick={() => onClickTabItem(id)}
                testId={id}
              />
              {child.props.id === activeTab && (
                <div
                  className={classNames({
                    hidden: activeTab !== id,
                  })}
                >
                  <div
                    className={classNames(
                      "border border-gray-200 p-5 font-light dark:border-gray-700",
                      {
                        "border-b-0":
                          !isLastItem && child.props.id !== activeTab,
                        "rounded-b-lg": isLastItem,
                      },
                    )}
                  >
                    {children}
                  </div>
                </div>
              )}
            </>
          );
        })}
      </div>
    </>
  );
};

const Header = ({
  isActive,
  label,
  onClick,
  isFirstItem,
  isLastItem,
  testId,
}) => {
  return (
    <h2 data-last={isLastItem} data-first={isFirstItem}>
      <button
        type="button"
        className={classNames(
          "flex w-full items-center justify-between  border  border-gray-200 p-5 text-left font-medium text-gray-600 hover:bg-gray-200 focus:ring-4 focus:ring-gray-200 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:focus:ring-gray-800",
          {
            "rounded-t-lg": isFirstItem,
            "rounded-b-lg border-b": isLastItem && !isActive,
            "border-t-0": !isFirstItem && !isActive,
            "border-b-0": isActive,
            "bg-gray-200 dark:bg-gray-800": isActive,
          },
        )}
        aria-expanded="true"
        onClick={onClick}
        data-testid={testId}
      >
        <span>{label}</span>
        {isActive ? (
          <svg
            data-accordion-icon
            className="h-6 w-6 shrink-0 rotate-180"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clip-rule="evenodd"
            ></path>
          </svg>
        ) : (
          <svg
            data-accordion-icon=""
            className="h-6 w-6 shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clip-rule="evenodd"
            ></path>
          </svg>
        )}
      </button>
    </h2>
  );
};
