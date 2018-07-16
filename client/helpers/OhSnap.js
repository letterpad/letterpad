import React from "react";
import PropTypes from "prop-types";
const OhSnap = ({ message }) => {
    return (
        <section className="card oh-snap">
            <div className="row">
                <div className="card">
                    <div className="module-title">Oh Snap!</div>
                    <div className="module-subtitle">{message}</div>
                </div>
            </div>
        </section>
    );
};

OhSnap.propTypes = {
    message: PropTypes.string.isRequired
};
export default OhSnap;
