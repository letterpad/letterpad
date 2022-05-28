import { DeleteOutlined, MenuOutlined } from "@ant-design/icons";
import { Button, Divider, Input, Modal } from "antd";
import React, { useState } from "react";
import { SortableElement } from "react-sortable-hoc";

import { Navigation, NavigationType } from "@/__generated__/__types__";

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
    <div data-testid="item-sortable" className="grid">
      <div className="block">
        <div className="icon-box">
          <MenuOutlined className="dragger" />
        </div>
        <Input
          value={item.label}
          onChange={(e) => onInputChange({ ...item, label: e.target.value })}
          data-testid={item.label === "" ? "empty-label-item" : ""}
          placeholder="Enter the name of this item"
          size="middle"
          className={nameError ? "hasError" : ""}
        />
      </div>

      <div className="menu-content block">
        <Input.Group className="menu-content-group">
          <Input
            style={{ width: "calc(100% - 150px)", cursor: "not-allowed" }}
            size="middle"
            value={item.type + ": " + item.original_name}
            readOnly
          />
          <Button
            type="default"
            size="middle"
            onClick={() => setShowModal(true)}
            data-testid="content-modal-btn"
          >
            Select Content
          </Button>
        </Input.Group>
        <Button
          type="primary"
          danger
          size="middle"
          onClick={() => setShowModal(true)}
        >
          <DeleteOutlined
            onClick={onRemove}
            data-testid="button-nav-delete"
            className="menu-delete"
          />
        </Button>
      </div>
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
          <div key={item.key}>{item}</div>
        ))}
      </Modal>
      <style jsx global>{`
        .icon-box {
          cursor: pointer;
        }
        .menu-delete {
          grid-area: menu-delete;
        }
        .menu-name {
          grid-area: menu-name;
        }

        .grid {
          display: flex;
          align-items: center;
          column-count: 5;
          gap: 10px;
          margin-bottom: 20px;
        }
        .block {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .menu-content {
          flex-grow: 1;
        }
        .hasError {
          border: 1px solid orange !important;
        }
        @media (max-width: 700px) {
          .grid {
            flex-direction: column;
            align-items: stretch;
            border-bottom: 1px solid rgb(var(--color-border));
            margin-bottom: 20px;
          }
          .grid {
            padding-bottom: 20px;
          }
          .block {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 8px;
          }
          .menu-content {
            flex-direction: column;
            margin-left: 20px;
            align-items: start;
          }
        }
      `}</style>
    </div>
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
