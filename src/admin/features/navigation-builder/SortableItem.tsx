import { InputBox, Item } from "./SortableItem.css";
import React, { useEffect, useState } from "react";

import DragIcon from "./drag.svg";
import { IMenu } from "../../../client/types";
import { Link } from "react-router-dom";
import { SortableElement } from "react-sortable-hoc";
import TrashIcon from "./trash.svg";

const SortableItem = SortableElement(props => {
  const { value, source, onChange, onRemove } = props;

  const [item, setItem] = useState(value);
  const [error, setError] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");

  //   useEffect(() => {
  //     onInputChange(item);
  //   }, []);

  const onInputChange = (change: IMenu) => {
    const changedItem = {
      ...item,
      ...change,
    };
    setNameError("");
    setError("");

    // check the title
    if (changedItem.title.length === 0) {
      setNameError("Cannot be empty");
    }

    // check the slug
    const itemFromDropdown = getItemBySlug(source, changedItem.slug);
    const isCustomUrl = isValidURL(changedItem.slug);

    if (!itemFromDropdown && !isCustomUrl) {
      setError("Should be an url or an item from dropdown");
      changedItem.type = "";
    } else if (isCustomUrl) {
      changedItem.type = "custom";
    }

    setItem(changedItem);
    if (!error && !nameError) {
      onChange(changedItem);
    }
  };

  return (
    <Item>
      <div className="icon-box">
        <img className="dragger" src={DragIcon} width="15" />
      </div>
      <div> &nbsp;&nbsp; </div>
      <InputBox hasError={nameError !== ""}>
        <input
          type="text"
          value={item.title}
          onChange={e => onInputChange({ ...item, title: e.target.value })}
          placeholder="Enter the name of this item"
        />
        <span className="error">{nameError}</span>
      </InputBox>
      <div> &nbsp;&nbsp; </div>
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
      <Link to="#" onClick={onRemove} className="icon-box">
        <img className="trashicon" src={TrashIcon} width="15" />
      </Link>
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
