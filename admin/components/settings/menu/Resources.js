import React from "react";

const Resources = ({ title, data, itemClicked }) => {
    return (
        <div>
            <h5>Add {title}</h5>
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

export default Resources;
