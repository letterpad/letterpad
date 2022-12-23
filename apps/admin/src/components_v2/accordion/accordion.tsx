import classNames from "classnames";
import { Children, useState } from "react";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md";

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
                      "border border-gray-200 p-4 font-light dark:border-gray-700",
                      {
                        "border-b-0":
                          !isLastItem && child.props.id !== activeTab,
                        "rounded-b-lg": isLastItem,
                      }
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
          "flex w-full items-center justify-between  border  border-gray-200 p-4 text-left font-medium text-gray-600 hover:bg-gray-200 focus:ring-4 focus:ring-gray-200 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:focus:ring-gray-800",
          {
            "rounded-t-lg": isFirstItem,
            "rounded-b-lg border-b": isLastItem && !isActive,
            "border-t-0": !isFirstItem && !isActive,
            "border-b-0": isActive,
            "bg-gray-200 dark:bg-gray-800": isActive,
          }
        )}
        aria-expanded="true"
        onClick={onClick}
        data-testid={testId}
      >
        <span>{label}</span>
        {isActive ? (
          <MdOutlineKeyboardArrowUp size={24} />
        ) : (
          <MdOutlineKeyboardArrowDown size={24} />
        )}
      </button>
    </h2>
  );
};
