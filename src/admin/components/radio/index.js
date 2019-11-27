import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const StyledRadio = styled.div`
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
const RadioBox = ({ data, onChange }) => {
  return (
    <StyledRadio>
      <label className="custom-label">{data.label}</label>
      <br />
      {data.options.map(option => (
        <div className="radio" key={option}>
          <input
            type="radio"
            name={data.name}
            value={option}
            id={option}
            defaultChecked={option === data.defaultValue}
            onClick={e => {
              onChange(data.name, e.target.value);
            }}
          />
          <label htmlFor={option} className="radio-label">
            {option}
          </label>
        </div>
      ))}
    </StyledRadio>
  );
};
RadioBox.propTypes = {
  data: PropTypes.object,
  onChange: PropTypes.func,
};

export default RadioBox;
