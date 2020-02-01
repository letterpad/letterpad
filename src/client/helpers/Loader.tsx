import React from "react";

const Loader: React.FC = () => {
  return (
    <div className="progress progress-striped active">
      <div
        className="progress-bar progress-bar-success"
        style={{ width: "100%" }}
      />
    </div>
  );
};

export default Loader;
