import { DeleteOutlined, MenuOutlined } from "@ant-design/icons";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button, Input } from "antd";
import { message } from "antd";
import { FC, useEffect, useState } from "react";

import { Navigation, NavigationType } from "@/__generated__/__types__";
import { IMenuWithError } from "@/shared/types";

interface INavigationUI extends Omit<Navigation, "type"> {
  hasError?: boolean;
  type: NavigationType;
}

interface Props {
  library: IMenuWithError;
  onChange: (change: IMenuWithError) => void;
  onRemove: (change: IMenuWithError) => void;
  openSuggestions: (id: number) => void;
}

export const Item: FC<Props> = ({
  library,
  onChange,
  onRemove,
  openSuggestions,
}) => {
  const { setNodeRef, attributes, listeners, transition, transform } =
    useSortable({ id: library.id });
  const [nameError, setNameError] = useState("");

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    background: "#FFF",
  };

  const source = [];

  const onInputChange = (change: INavigationUI) => {
    const changedItem = {
      ...library,
      ...change,
    };
    changedItem.slug = changedItem.slug.split("/").pop() as string;

    const tmpError = {
      nameError: "",
      error: "",
    };

    // check the label
    if (changedItem.label.length === 0) {
      tmpError.nameError = "Label cannot be empty";
    }

    // check the slug
    const itemFromDropdown = getItemBySlug(source, changedItem.slug);

    if (itemFromDropdown) {
      changedItem.type = itemFromDropdown.type;
      changedItem.original_name = itemFromDropdown.original_name;
      changedItem.slug = itemFromDropdown.slug.split("/").pop() as string;
    }

    changedItem.hasError =
      tmpError.error.length > 0 || tmpError.nameError.length > 0;

    if (!tmpError.error) {
      onChange(changedItem);
    }
    setNameError(tmpError.nameError);
  };

  useEffect(() => {
    if (nameError.length > 0) {
      message.error(nameError);
    }
  }, [nameError]);
  return (
    <div style={style} {...attributes} ref={setNodeRef}>
      <div data-testid="item-sortable" className="grid">
        <div className="block">
          <div
            className="icon-box"
            {...listeners}

            // className={styles.container}
          >
            <MenuOutlined className="dragger" />
          </div>
          <Input
            value={library.label}
            onChange={(e) =>
              onInputChange({ ...library, label: e.target.value })
            }
            data-testid={library.label === "" ? "empty-label-item" : ""}
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
              value={library.type + ": " + library.original_name}
              readOnly
            />
            <Button
              type="default"
              size="middle"
              onClick={() => openSuggestions(library.id)}
              data-testid="content-modal-btn"
            >
              Select Content
            </Button>
          </Input.Group>
          <Button
            type="primary"
            danger
            size="middle"
            onClick={() => onRemove(library)}
          >
            <DeleteOutlined
              data-testid="button-nav-delete"
              className="menu-delete"
            />
          </Button>
        </div>

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
    </div>
  );
};

function getItemBySlug(data: Navigation[], slug: string) {
  const arr = data.filter((item) => item.slug === "/" + item.type + "/" + slug);
  if (arr) {
    return arr[0];
  }
  return null;
}
