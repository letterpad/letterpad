import React from "react";
import PropTypes from "prop-types";

const Footer = props => (
    <div className="footer">
        <div
            className="footer-open"
            dangerouslySetInnerHTML={{ __html: props.data }}
        />
        <div className="footer-closed">{/* Small icon for footer. TBD */}</div>
    </div>
);

Footer.propTypes = {
    data: PropTypes.string.isRequired
};

export default Footer;
