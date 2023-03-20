import React from "react";

const StaticLayout = ({ children }) => {
  return (
    <>
      <div className="flex h-screen flex-1 flex-col">
        <div className="bg-gray-200 p-6 dark:bg-gray-800">
          <img src="/admin/uploads/logo.png" width={28} alt="logo" />
        </div>
        <div className="flex flex-1 justify-center pt-20">{children}</div>
        <div className="p-6 text-center">
          Letterpad ©2023, An Open Source Project
        </div>
      </div>
    </>
  );
};

export default StaticLayout;
