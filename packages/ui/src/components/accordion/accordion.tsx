import classNames from "classnames";
import { Children, useState } from "react";
import { BiPlus } from "react-icons/bi";
import { CgMathMinus } from "react-icons/cg";

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
          const { label, id, children, description } = child.props;
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
                description={description}
              />
              {child.props.id === activeTab && (
                <div
                  className={classNames({
                    hidden: activeTab !== id,
                  })}
                >
                  <div
                    className={classNames(
                      "border border-gray-200 p-4 dark:border-gray-700",
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
  description,
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
          "flex w-full flex-row items-center border border-gray-200 p-4 text-left font-medium text-gray-600 hover:bg-gray-50 focus:ring-4 focus:ring-gray-200 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus:ring-gray-800",
          {
            "rounded-t-lg": isFirstItem,
            "rounded-b-lg border-b": isLastItem && !isActive,
            "border-t-0": !isFirstItem && !isActive,
            "border-b-0": isActive,
            "bg-gray-100 dark:bg-gray-800": isActive,
          }
        )}
        aria-expanded="true"
        onClick={onClick}
        data-testid={testId}
      >
        <span className="flex w-full flex-col justify-between">
          <span className="text-base-1 font-normal">{label}</span>
          <span className="text-muted">{description}</span>
        </span>
        {isActive ? <CgMathMinus size={24} /> : <BiPlus size={24} />}
      </button>
    </h2>
  );
};
