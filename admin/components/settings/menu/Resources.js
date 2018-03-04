import React from "react";
import PropTypes from "prop-types";

const Resources = ({ title, data, itemClicked }, { t }) => {
    return (
        <div>
            <h5>{t(`menu.${title}`)}</h5>
            <ul className="list-group resources">
                {data.map((item, i) => {
                    const disabled = item.disabled ? { disabled: true } : {};
                    return (
                        <li
                            className="list-group-item"
                            key={i}
                            onClick={() => !item.disabled && itemClicked(i)}
                            {...disabled}
                        >
                            {item.label}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

Resources.contextTypes = {
    t: PropTypes.func
};

export default Resources;
