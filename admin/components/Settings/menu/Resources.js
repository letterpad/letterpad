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
                            {item.title}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

Resources.propTypes = {
    title: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
                .isRequired,
            title: PropTypes.string.isRequired,
            type: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            url: PropTypes.string
        })
    ),
    itemClicked: PropTypes.func
};

Resources.contextTypes = {
    t: PropTypes.func
};

export default Resources;
