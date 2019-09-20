import React from "react";
import MenuItems from "./MenuItems";
import PropTypes from "prop-types";

const Menuhorizontal = ({ items }) => {
  const secondaryMenuItems = React.createRef();
  return <MenuItems ref={secondaryMenuItems} secondary={true} items={items} />;
};
Menuhorizontal.propTypes = {
  items: PropTypes.array.isRequired,
};
export default Menuhorizontal;
