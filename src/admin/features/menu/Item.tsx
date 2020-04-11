import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import React from "react";

const Item = ({ type, slug, name }) => {
  let pathname = "";
  if (type === "page") {
    pathname = "/page/" + slug;
  } else if (type == "tag") {
    pathname = "/posts/" + slug;
  }
  return <li>{name && <Link to={pathname}>{name}</Link>}</li>;
};

Item.propTypes = {
  type: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default Item;
