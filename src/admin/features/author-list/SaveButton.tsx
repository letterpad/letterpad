import React from "react";
import PropTypes from "prop-types";

const SaveButton = ({ handleClick }) => {
  return (
    <button type="submit" onClick={handleClick} className="btn btn-blue btn-sm">
      Save
    </button>
  );
};

SaveButton.propTypes = {
  handleClick: PropTypes.func.isRequired,
};

export default SaveButton;
