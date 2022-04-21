import { InputBox, Item } from "./SortableItem.css";
import React, { useState } from "react";

import { SortableElement } from "react-sortable-hoc";
import { Input, Button, Modal, Divider } from "antd";
import { Navigation, NavigationType } from "@/__generated__/__types__";
import { DeleteOutlined, MenuOutlined } from "@ant-design/icons";

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
  const [showModal, setShowModal] = useState(false);
  const [item, setItem] = useState<INavigationUI>(value);
  const [nameError, setNameError] = useState<string>("");

  const onInputChange = (change: INavigationUI) => {
    const changedItem = {
      ...item,
      ...change,
    };
    changedItem.slug = changedItem.slug.split("/").pop() as string;

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

    if (itemFromDropdown) {
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

    setNameError(tmpError.nameError);
  };

  const onClick = (slug) => {
    onInputChange({ ...item, slug });
    setShowModal(false);
  };
  return (
    <Item data-testid="item-sortable">
      <div className="icon-box">
        <MenuOutlined className="dragger" />
      </div>
      <InputBox hasError={nameError !== ""}>
        <Input
          value={item.label}
          onChange={(e) => onInputChange({ ...item, label: e.target.value })}
          data-testid={item.label === "" ? "empty-label-item" : ""}
          placeholder="Enter the name of this item"
          size="middle"
        />
        <span className="error">{nameError}</span>
      </InputBox>
      <div>
        <Input.Group>
          <Input
            style={{ width: "calc(100% - 150px)", cursor: "not-allowed" }}
            size="middle"
            value={item.type + ": " + item.original_name}
            readOnly
          />
          <Button
            type="primary"
            size="middle"
            onClick={() => setShowModal(true)}
            data-testid="content-modal-btn"
          >
            Select Content
          </Button>
        </Input.Group>
      </div>

      <DeleteOutlined onClick={onRemove} data-testid="button-nav-delete" />

      <Modal
        title="Assign Content to Navigation Menu"
        visible={showModal}
        okText={false}
        onCancel={() => setShowModal(false)}
        footer={[
          <Button
            key="cancel"
            type="primary"
            onClick={() => setShowModal(false)}
            size="middle"
          >
            Cancel
          </Button>,
        ]}
      >
        Assign a tag to display all posts linked with that tag
        <p />
        {getOptions(source, NavigationType.Tag, onClick)}
        <p />
        <p />
        <p />
        <Divider />
        Assign a page <p />
        {getOptions(source, NavigationType.Page, onClick).map((item) => (
          <div>{item}</div>
        ))}
      </Modal>
    </Item>
  );
});

export default SortableItem;

function getItemBySlug(data: Navigation[], slug: string) {
  const arr = data.filter((item) => item.slug === "/" + item.type + "/" + slug);
  if (arr) {
    return arr[0];
  }
  return null;
}

function getSuggestionLabel(item) {
  if (item.type === "tag") {
    return `${item.label}  (${item.postCount} post/s)`;
  }
  return `${item.label}`;
}

function getOptions(source: Navigation[], type: NavigationType, onClick) {
  return source
    .filter((navItem) => navItem.type === type)
    .map((navItem) => (
      <Button
        key={navItem.slug}
        value={navItem.slug}
        data-testid={navItem.slug}
        type="link"
        onClick={() => onClick(navItem.slug)}
      >
        {getSuggestionLabel(navItem)}
      </Button>
    ));
}
