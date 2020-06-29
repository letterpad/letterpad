import React, { useState } from "react";

import styled from "styled-components";

const CheckBox = props => {
  const [selected, setSelected] = useState<string[]>(props.defaultValue);

  const onChange = e => {
    const newSelections = [...selected];
    if (e.target.checked) {
      newSelections.push(e.target.value);
    } else {
      newSelections.splice(selected.indexOf(e.target.value), 1);
    }
    const selections = [...new Set(newSelections)];
    setSelected(selections);
    props.onChange(selections);
  };

  return (
    <Container>
      <label className="custom-label">{props.label}</label>
      <br />
      <br />
      <div className="checkbox-group">
        {props.options.map(option => {
          return (
            <>
              <input
                className="form-checkbox"
                name={props.name}
                id={option}
                onChange={onChange}
                value={option}
                checked={selected.indexOf(option) > -1}
                type="checkbox"
              />
              <label key={option} htmlFor={option}>
                {option}
              </label>
            </>
          );
        })}
      </div>
    </Container>
  );
};

const Container = styled.div`
  .checkbox-group label {
    margin-right: 20px;
    &:last-child {
      margin-right: 0px;
    }
    cursor: pointer;
    display: flex;
    align-items: center;
  }
  input[type="checkbox"] {
    display: none;
  }
  input[type="checkbox"] + label::before {
    width: 15px;
    height: 15px;
    background: var(--bg-sections);
    border: 1px solid #aaa;
    display: block;
    content: "";
    float: left;
    margin-right: 5px;
    cursor: pointer;
  }
  input[type="checkbox"]:checked + label::before {
    background: #aaa;
  }
  .checkbox-group {
    display: flex;
    align-items: center;
  }
`;

export default CheckBox;
