import React from "react";

const Header = ({ title, subtitle }) => {
    return (
        <div className="page-header">
            <h1>{title}</h1>
            <span>{subtitle}</span>
        </div>
    );
};

export default Header;
