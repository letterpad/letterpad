import React from "react";
import PropTypes from "prop-types";

export const InputBox = ({ data, onChange }) => {
    return (
        <div className="form-group">
            <label className="custom-label">{data.label}</label>
            <input
                defaultValue={data.defaultValue}
                type={data.type || "text"}
                className="form-control"
                placeholder={data.placeholder || ""}
                aria-invalid="false"
                onBlur={e => onChange(data.name, e.target.value)}
            />
        </div>
    );
};
InputBox.propTypes = {
    data: PropTypes.object,
    onChange: PropTypes.func
};

export const RadioBox = ({ data, onChange }) => {
    return (
        <div className="form-group">
            <label className="custom-label">{data.label}</label>
            <br />
            {data.options.map(option => (
                <label key={option} className="radio-inline">
                    <input
                        type="radio"
                        name={data.name}
                        value={option}
                        defaultChecked={option === data.defaultValue}
                        onClick={e => onChange(data.name, e.target.value)}
                    />
                    {option}
                </label>
            ))}
        </div>
    );
};
RadioBox.propTypes = {
    data: PropTypes.object,
    onChange: PropTypes.func
};

let cbRegistry = [];
export const CheckBox = ({ data, onChange }) => {
    if (cbRegistry.length === 0) {
        cbRegistry = [...data.defaultValue];
    }
    const handleCheckBoxChange = e => {
        const index = cbRegistry.indexOf(e.target.value);
        // if found then remove
        if (index >= 0) {
            cbRegistry.splice(index, 1);
        } else {
            cbRegistry.push(e.target.value);
        }
        onChange(data.name, cbRegistry);
    };
    return (
        <div className="form-group">
            <label className="custom-label">{data.label}</label>
            <br />
            {data.options.map(option => (
                <label key={option} className="checkbox-inline">
                    <input
                        type="checkbox"
                        name={data.name}
                        value={option}
                        defaultChecked={data.defaultValue.indexOf(option) >= 0}
                        onClick={handleCheckBoxChange}
                    />
                    {option}
                </label>
            ))}
        </div>
    );
};
CheckBox.propTypes = {
    data: PropTypes.object,
    onChange: PropTypes.func
};

export const SelectBox = ({ data, onChange }) => {
    return (
        <div className="form-group">
            <label className="custom-label">{data.label}</label>
            <br />
            <select onChange={e => onChange(data.name, e.target.value)}>
                {data.options.map(option => (
                    <option
                        key={option}
                        selected={option === data.defaultValue}
                        name={data.name}
                        value={option}
                    >
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
};
SelectBox.propTypes = {
    data: PropTypes.object,
    onChange: PropTypes.func
};
