import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Navigation, NavigationType } from "letterpad-graphql";
import { FC, useEffect, useState } from "react";
import { AiOutlineDelete, AiOutlineMenu } from "react-icons/ai";
import { Button, Input as Inputv2, Message } from "ui/dist/index.mjs";

import { IMenuWithError } from "@/types";

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
      Message().error({ content: nameError });
    }
  }, [nameError]);

  const type =
    library.type === NavigationType.Custom
      ? "Select a tag or page"
      : library.type;
  return (
    <div style={style} {...attributes} ref={setNodeRef}>
      <div data-testid="item-sortable" className="grid">
        <div className="block">
          <div className="icon-box" {...listeners}>
            <AiOutlineMenu className="dark:text-white" />
          </div>
          <Inputv2
            value={library.label}
            onChange={(e) =>
              onInputChange({ ...library, label: e.target.value })
            }
            data-testid={library.label === "" ? "empty-label-item" : ""}
            placeholder="Name"
            error={!!nameError}
          />
        </div>

        <div className="menu-content block">
          <div className="flex-1">
            <Inputv2
              style={{ width: "calc(100%)", cursor: "not-allowed" }}
              value={type + ": " + library.original_name}
              disabled
            />
          </div>
          <Button
            variant="primary"
            onClick={(e) => {
              e.preventDefault();
              openSuggestions(library.id);
            }}
            data-testid="content-modal-btn"
          >
            Select Content
          </Button>
          <Button
            variant="danger"
            onClick={(e) => {
              e.preventDefault();
              onRemove(library);
            }}
            className="px-0 py-0"
          >
            <AiOutlineDelete
              size={20}
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
