import { InputBox, Item } from "./SortableItem.css";
import React, { useState } from "react";

import ReactTooltip from "react-tooltip";
import { SortableElement } from "react-sortable-hoc";
import { Tooltip, Select, Input } from "antd";
import { Navigation, NavigationType } from "@/__generated__/type-defs.graphqls";
import {
  DeleteOutlined,
  InfoCircleOutlined,
  MenuOutlined,
} from "@ant-design/icons";

const { Option, OptGroup } = Select;

interface IProps {
  source: Navigation[];
  value: Navigation;
  onChange: (change: any) => void;
  onRemove: (e: React.MouseEvent) => void;
}

interface INavigationUI extends Omit<Navigation, "type"> {
  hasError?: boolean;
  type: NavigationType | "";
}

const SortableItem = SortableElement((props: IProps) => {
  const { value, source, onChange, onRemove } = props;

  const [item, setItem] = useState<INavigationUI>(value);
  const [error, setError] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");

  const onInputChange = (change: INavigationUI) => {
    const changedItem = {
      ...item,
      ...change,
      slug: change.slug.split("/").pop() as string,
    };
    const tmpError = {
      nameError: "",
      error: "",
    };

    // check the label
    if (changedItem.label.length === 0) {
      tmpError.nameError = "Cannot be empty";
    }

    // check the slug
    const itemFromDropdown = getItemBySlug(source, changedItem.slug);
    const isCustomUrl = isValidURL(changedItem.slug);

    if (!itemFromDropdown && !isCustomUrl) {
      tmpError.error = "Should be an url or an item from dropdown";
    } else if (isCustomUrl) {
      changedItem.type = NavigationType.Custom;
    } else if (itemFromDropdown) {
      changedItem.type = itemFromDropdown.type;
      changedItem.original_name = itemFromDropdown.original_name;
      changedItem.slug = itemFromDropdown.slug.split("/").pop() as string;
    }

    setItem(changedItem);
    changedItem.hasError =
      tmpError.error.length > 0 || tmpError.nameError.length > 0;
    if (!tmpError.error) {
      onChange(changedItem);
    }
    setError(tmpError.error);
    setNameError(tmpError.nameError);
    setTimeout(ReactTooltip.rebuild, 0);
  };

  return (
    <Item data-testid="item-sortable">
      <div className="icon-box">
        <MenuOutlined className="dragger" />
      </div>
      <InputBox hasError={nameError !== ""}>
        <Input
          value={item.label}
          onChange={e => onInputChange({ ...item, label: e.target.value })}
          data-testid={item.label === "" ? "empty-label-item" : ""}
          placeholder="Enter the name of this item"
          size="middle"
        />
        <span className="error">{nameError}</span>
      </InputBox>
      <div>
        <Select
          defaultValue={item.slug}
          style={{ width: "100%" }}
          size="middle"
          // onChange={handleChange}
        >
          <OptGroup label="Tags - collection of post">
            {getOptions(source, NavigationType.Tag)}
          </OptGroup>
          <OptGroup label="Pages">
            {getOptions(source, NavigationType.Page)}
          </OptGroup>
        </Select>
      </div>
      <Tooltip title={getToolTip(item)}>
        <InfoCircleOutlined />
      </Tooltip>

      <DeleteOutlined onClick={onRemove} data-testid="button-nav-delete" />

      <ReactTooltip />
    </Item>
  );
});

export default SortableItem;

function getItemBySlug(data: Navigation[], slug: string) {
  const arr = data.filter(item => item.slug === "/" + item.type + "/" + slug);
  if (arr) {
    return arr[0];
  }
  return null;
}

function isValidURL(url: string) {
  if (!url) return false;
  const res = url.match(
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
  );
  return res !== null;
}

function getToolTip(item: INavigationUI) {
  if (item.type === NavigationType.Tag) {
    return "Displays all posts having the tag - " + item.slug;
  }
  if (item.type === NavigationType.Page) {
    return "Displays page - " + item.original_name;
  }
  if (item.type === NavigationType.Custom) {
    return "This will be opened in a new tab.";
  }
}

function getSuggestionLabel(item) {
  if (item.type === "tag") {
    return `${item.label}  (${item.postCount} post/s)`;
  }
  return `${item.label}`;
}

function getOptions(source: Navigation[], type: NavigationType) {
  return source
    .filter(navItem => navItem.type === type)
    .map(navItem => (
      <Option key={navItem.slug} value={navItem.slug}>
        {getSuggestionLabel(navItem)}
      </Option>
    ));
}
