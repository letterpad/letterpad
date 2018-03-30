import React from "react";

const OhSnap = ({ message }) => {
    return (
        <section className="card">
            <div className="row">
                <div className="card">
                    <div className="module-title">Oh Snap!</div>
                    <div className="module-subtitle">{message}</div>
                </div>
            </div>
        </section>
    );
};

export default OhSnap;
