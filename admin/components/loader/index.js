import React from "react";
import PropTypes from "prop-types";

const Loader = ({ type }) =>
  type == "spin" ? (
    <i className="fa fa-circle-o-notch fa-spin fa-2x" />
  ) : (
    <div className="progress progress-striped active" style={{ height: 6 }}>
      <div
        className="progress-bar progress-bar-success"
        style={{ width: "100%" }}
      />
    </div>
  );

Loader.propTypes = {
  type: PropTypes.string,
};

export default Loader;
