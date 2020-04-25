import React from "react";
import styled from "styled-components";

interface IProps {
  onChange: (state: boolean) => void;
  leftLabel: string;
  rightLabel?: string;
  isSelected: boolean;
  className?: string;
}

const StyledSwitch: React.FC<IProps> = ({
  onChange,
  leftLabel,
  rightLabel,
  isSelected,
  className,
}) => {
  return (
    <Container className={className}>
      <span
        className="switch-label switch-off-text"
        onClick={() => onChange(false)}
      >
        {leftLabel}
      </span>
      <label className="switch">
        <input
          type="checkbox"
          onChange={e => onChange(!!+e.target.checked)} // "false" to false
          checked={isSelected}
        />
        <span className="slider round" />
      </label>
      {rightLabel && (
        <span
          className="switch-label switch-on-text"
          onClick={() => onChange(true)}
        >
          {rightLabel}
        </span>
      )}
    </Container>
  );
};

export default StyledSwitch;

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 44px;
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
        background-color: var(--color-accent);
      }
      &:focus + .slider {
        box-shadow: 0 0 1px var(--color-accent);
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
    transition: 0.2s color linear;
    opacity: 0.6;
    font-weight: 400;
    font-size: 0.7rem;
    letter-spacing: 1px;
}
  }
  &.on .switch-on-text {
    color: var(--color-text-secondary);
  }
  &.off .switch-off-text {
    color: var(--color-text-secondary);
  }
`;
