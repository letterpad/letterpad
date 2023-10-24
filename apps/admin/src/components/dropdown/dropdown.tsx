import React, { FC, useEffect, useState } from "react";

interface Props {
  label: string;
  options: any[];
  testId?: string;
}

export const Dropdown: FC<Props> = ({ label, options, testId }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    function handleClose(e) {
      setIsDropdownOpen(false);
    }

    window.addEventListener("click", handleClose);
    return () => {
      window.removeEventListener("click", handleClose);
    };
  }, []);

  const handleDropdownClick = (e) => {
    if (!isDropdownOpen) {
      e.preventDefault();
      e.stopPropagation();
      setIsDropdownOpen(true);
    }
  };

  const handleTogglerClick = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  return (
    <div
      onClick={handleDropdownClick}
      tabIndex={0}
      role="button"
      className="dropdown-container"
    >
      <button
        id="dropdownBtn"
        data-testid={testId}
        data-dropdown-toggle="dropdown"
        className="inline-flex items-center rounded-lg bg-blue-700 px-4 py-2 text-center text-xs font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
      >
        {label}{" "}
        <svg
          className="ml-2.5 h-2.5 w-2.5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>
      {isDropdownOpen && (
        <div className="dropdown__content">
          <div
            id="dropdown"
            className="absolute z-10 -ml-20 mt-2 w-44 divide-y divide-gray-100 rounded-lg bg-white shadow dark:bg-gray-700"
          >
            <ul
              className="py-2 text-sm text-gray-700 dark:text-gray-200"
              aria-labelledby="dropdownBtn"
            >
              {options.map((option, index) => (
                <li className={option.hidden ? "hidden" : ""} key={index}>
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      option.onClick(option);
                    }}
                    href="#"
                    data-testid={option.testId}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    <option.icon size={14} /> {option.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
