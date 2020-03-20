import React from "react";
import styled from "styled-components";

const StyledRadio = styled.div`
  .horizontal {
    display: flex;
    justify-content: center;
  }
  .radio {
    margin: 0.5rem;
    input[type="radio"] {
      position: absolute;
      opacity: 0;
      + .radio-label {
        &:before {
          content: "";
          background: var(--bg-sections);
          border-radius: 100%;
          border: 1px solid #eee;
          display: inline-block;
          width: 1.4em;
          height: 1.4em;
          position: relative;
          top: -0.2em;
          margin-right: 1em;
          vertical-align: top;
          cursor: pointer;
          text-align: center;
          transition: all 250ms ease;
        }
      }
      &:checked {
        + .radio-label {
          &:before {
            background-color: #ddd;
          }
        }
      }
      &:focus {
        + .radio-label {
          &:before {
            outline: none;
            border-color: #ddd;
          }
        }
      }
      &:disabled {
        + .radio-label {
          &:before {
            box-shadow: inset 0 0 0 4px $color1;
            border-color: darken($color1, 25%);
            background: darken($color1, 25%);
          }
        }
      }
      + .radio-label {
        &:empty {
          &:before {
            margin-right: 0;
          }
        }
      }
    }
  }
`;
const RadioBox: React.FC<any> = ({
  options,
  label,
  onChange,
  defaultValue,
  name,
  ...props
}) => {
  const groupName = "rb-" + Date.now();
  return (
    <StyledRadio>
      <label className="custom-label">{label}</label>
      <br />
      <br />
      <div className="horizontal">
        {options.map(option => (
          <div className="radio" key={option}>
            <input
              type="radio"
              name={groupName}
              value={option}
              id={"rb-" + option}
              defaultChecked={option === defaultValue}
              onClick={(e: any) => {
                onChange(e.target.value);
              }}
              {...props}
            />
            <label htmlFor={"rb-" + option} className="radio-label">
              {option}
            </label>
          </div>
        ))}
      </div>
    </StyledRadio>
  );
};

export default RadioBox;
