import { InputBox, Item } from "./SortableItem.css";
import React, { useState } from "react";

import { Button } from "../../../components/button";
import { Navigation } from "../../../../__generated__/gqlTypes";
import ReactTooltip from "react-tooltip";
import { SortableElement } from "react-sortable-hoc";

const SortableItem = SortableElement(props => {
  const { value, source, onChange, onRemove } = props;

  const [item, setItem] = useState(value);
  const [error, setError] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");

  const onInputChange = (change: Navigation) => {
    const changedItem = {
      ...item,
      ...change,
    };
    const error = {
      nameError: "",
      error: "",
    };

    // check the label
    if (changedItem.label.length === 0) {
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
      changedItem.original_name = itemFromDropdown.original_name;
    }

    setItem(changedItem);
    changedItem.hasError = error.error.length > 0 || error.nameError.length > 0;
    if (!error.error) {
      onChange(changedItem);
    }
    setError(error.error);
    setNameError(error.nameError);
    setTimeout(ReactTooltip.rebuild, 0);
  };

  return (
    <Item data-testid="item-sortable">
      <div className="icon-box">
        <i className="fa fa-bars dragger" />
      </div>
      <InputBox hasError={nameError !== ""}>
        <input
          type="text"
          value={item.label}
          onChange={e => onInputChange({ ...item, label: e.target.value })}
          data-testid={item.label === "" ? "empty-label-item" : ""}
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
            data-testid={item.slug === "" ? "empty-slug-item" : ""}
            onChange={e => onInputChange({ ...item, slug: e.target.value })}
          />
          <span className="error">{error}</span>
        </InputBox>
        <datalist id="menu-items">
          {...source.map(item => (
            <option
              key={item.slug}
              label={getSuggestionLabel(item)}
              value={item.slug}
            ></option>
          ))}
        </datalist>
      </div>
      <i className="fa fa-info" data-tip={getToolTip(item)} />
      <Button
        btnStyle="danger"
        compact
        btnSize="xs"
        onClick={onRemove}
        data-testid="button-nav-delete"
      >
        <i className="fa fa-trash" />
      </Button>
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
  if (item.type === "tag") {
    return "Displays all posts having the tag - " + item.original_name;
  }
  if (item.type === "page") {
    return "Displays page - " + item.original_name;
  }
  if (item.type === "custom") {
    return "This will be opened in a new tab.";
  }
}

function getSuggestionLabel(item) {
  if (item.type === "tag") {
    return `#tag - ${item.label}  (${item.postCount} post/s)`;
  }
  return `page - ${item.label}`;
}
