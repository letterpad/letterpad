import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    .switch {
        margin: 0 20px;
        position: relative;
        display: inline-block;
        width: 30px;
        height: 12px;

        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: 0.4s;
            &:before {
                position: absolute;
                content: "";
                height: 20px;
                width: 20px;
                left: -6px;
                bottom: -3px;
                background-color: white;
                -webkit-transition: 0.4s;
                transition: 0.4s;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.28);
            }
            &.round {
                border-radius: 34px;
                &:before {
                    border-radius: 50%;
                }
            }
        }

        input {
            display: none;

            &:checked + .slider {
                background-color: rgba(var(--color-accent), 0.7);
            }
            &:focus + .slider {
                box-shadow: 0 0 1px rgba(var(--color-accent), 0.7);
            }
            &:checked + .slider:before {
                -webkit-transform: translateX(26px);
                -ms-transform: translateX(26px);
                transform: translateX(26px);
            }
        }
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
