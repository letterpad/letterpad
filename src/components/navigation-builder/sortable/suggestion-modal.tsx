import { Button, Divider } from "antd";
import Modal from "antd/lib/modal/Modal";

import { NavigationType } from "@/__generated__/__types__";

export const SuggestionModal = ({ suggestions, onSelect, isOpen, onClose }) => {
  return (
    <Modal
      title="Assign Content to Navigation Menu"
      visible={isOpen}
      okText={false}
      onCancel={() => onClose()}
      footer={[
        <Button
          key="cancel"
          type="primary"
          onClick={() => onClose()}
          size="middle"
        >
          Cancel
        </Button>,
      ]}
    >
      Assign a tag to display all posts linked with that tag
      <p />
      {getOptions(suggestions, NavigationType.Tag, onSelect)}
      <p />
      <p />
      <p />
      <Divider />
      Assign a page <p />
      {getOptions(suggestions, NavigationType.Page, onSelect).map((library) => (
        <div key={library.key}>{library}</div>
      ))}
    </Modal>
  );
};

function getSuggestionLabel(item) {
  if (item.type === "tag") {
    return `${item.label}  (${item.postCount} post/s)`;
  }
  return `${item.label}`;
}

function getOptions(source, type: NavigationType, onClick) {
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
