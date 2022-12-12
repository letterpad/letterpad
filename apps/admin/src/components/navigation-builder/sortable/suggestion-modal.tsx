import Modal from "antd/lib/modal/Modal";

import { Buttonv2 } from "@/components_v2/button";
import { Divider } from "@/components_v2/divider";

import { NavigationType } from "@/__generated__/__types__";

export const SuggestionModal = ({ suggestions, onSelect, isOpen, onClose }) => {
  return (
    <Modal
      title="Assign Content to Navigation Menu"
      visible={isOpen}
      okText={false}
      onCancel={() => onClose()}
      footer={[
        <Buttonv2
          key="cancel"
          variant="primary"
          onClick={() => onClose()}
          size="normal"
        >
          Cancel
        </Buttonv2>,
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
      <Buttonv2
        key={navItem.slug}
        data-testid={navItem.slug}
        onClick={() => onClick(navItem.slug)}
        variant="ghost"
      >
        {getSuggestionLabel(navItem)}
      </Buttonv2>
    ));
}
