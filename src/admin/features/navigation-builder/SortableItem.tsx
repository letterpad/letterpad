import { InputBox, Item } from "./SortableItem.css";
import React, { useState } from "react";

import { IMenu } from "../../../client/types";
import { Link } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import { SortableElement } from "react-sortable-hoc";

const SortableItem = SortableElement(props => {
  const { value, source, onChange, onRemove } = props;

  const [item, setItem] = useState(value);
  const [error, setError] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");

  const onInputChange = (change: IMenu) => {
    const changedItem = {
      ...item,
      ...change,
    };
    const error = {
      nameError: "",
      error: "",
    };

    // check the title
    if (changedItem.title.length === 0) {
      error.nameError = "Cannot be empty";
    }

    // check the slug
    const itemFromDropdown = getItemBySlug(source, changedItem.slug);
    const isCustomUrl = isValidURL(changedItem.slug);

    if (!itemFromDropdown && !isCustomUrl) {
      error.error = "Should be an url or an item from dropdown";
      changedItem.type = "";
    } else if (isCustomUrl) {
      changedItem.type = "custom";
    } else {
      changedItem.type = itemFromDropdown.type;
      changedItem.originalName = itemFromDropdown.originalName;
    }

    setItem(changedItem);
    changedItem.hasError = error.error.length > 0 || error.nameError.length > 0;
    onChange(changedItem);
    setError(error.error);
    setNameError(error.nameError);
    setTimeout(ReactTooltip.rebuild, 0);
  };

  return (
    <Item>
      <div className="icon-box">
        <i className="fa fa-bars dragger" />
      </div>
      <InputBox hasError={nameError !== ""}>
        <input
          type="text"
          value={item.title}
          onChange={e => onInputChange({ ...item, title: e.target.value })}
          placeholder="Enter the name of this item"
        />
        <span className="error">{nameError}</span>
      </InputBox>
      <div>
        <InputBox hasError={error !== ""}>
          <input
            list="menu-items"
            placeholder="Select or enter a custom url"
            value={item.slug}
            onChange={e => onInputChange({ ...item, slug: e.target.value })}
          />
          <span className="error">{error}</span>
        </InputBox>
        <datalist id="menu-items">
          {...source.map(item => (
            <option
              key={item.slug}
              label={item.type + " - " + item.name}
              value={item.slug}
            ></option>
          ))}
        </datalist>
      </div>
      <i className="fa fa-info" data-tip={getToolTip(item)} />
      <Link to="#" onClick={onRemove} className="icon-box">
        <i className="fa fa-trash" />
      </Link>
      <ReactTooltip />
    </Item>
  );
});

export default SortableItem;

function getItemBySlug(data, slug) {
  const arr = data.filter(item => item.slug === slug);
  if (arr) {
    return arr[0];
  }
}

function isValidURL(url: string) {
  var res = url.match(
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
  );
  return res !== null;
}

function getToolTip(item) {
  if (item.type === "category") {
    return "Displays all posts having the category - " + item.originalName;
  }
  if (item.type === "page") {
    return "Displays page - " + item.originalName;
  }
  if (item.type === "custom") {
    return "This will be opened in a new tab.";
  }
}
