import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    .switch {
        margin: 0 20px;
    }
    .switch-label {
        text-transform: uppercase;
        letter-spacing: 1px;
        font-size: 12px;
        font-weight: 500;
        color: var(--color-text-primary)-light;
        transition: 0.2s color linear;
    }
    &.on .switch-on-text {
        color: var(--color-text-secondary);
    }
    &.off .switch-off-text {
        color: var(--color-text-secondary);
    }
`;

const StyledSwitch = ({ onChange, leftLabel, rightLabel, isSelected }) => {
    return (
        <Wrapper>
            <span className="switch-label switch-off-text">{leftLabel}</span>
            <label className="switch">
                <input
                    type="checkbox"
                    onChange={onChange}
                    checked={isSelected}
                />
                <span className="slider round" />
            </label>
            <span className="switch-label switch-on-text">{rightLabel}</span>
        </Wrapper>
    );
};

StyledSwitch.propTypes = {
    leftLabel: PropTypes.string.isRequired,
    rightLabel: PropTypes.string.isRequired,
    isSelected: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired
};

export default StyledSwitch;
