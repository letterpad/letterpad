import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import React from "react";

const Footer = props => (
  <div className="footer">
    <Link
      className="view-site"
      target="_blank"
      rel="noopener noreferrer"
      to={"/"}
    >
      View site
    </Link>
    {/* <div
      className="footer-open"
      dangerouslySetInnerHTML={{ __html: props.data }}
    />
    <div className="footer-closed">...</div> */}
  </div>
);

Footer.propTypes = {
  data: PropTypes.string.isRequired,
};

export default Footer;
