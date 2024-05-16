import { NavigationType } from "letterpad-graphql";
import { Button, Divider, Modal } from "ui/dist/index.mjs";

export const SuggestionModal = ({ suggestions, onSelect, isOpen, onClose }) => {
  return (
    <Modal
      header="Assign Content to Navigation Menu"
      show={isOpen}
      toggle={() => onClose()}
      footer={[
        <Button
          key="cancel"
          variant="primary"
          onClick={() => onClose()}
          size="normal"
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
        data-testid={navItem.slug}
        onClick={() => onClick(navItem.slug)}
        variant="link"
        className="px-0"
      >
        {getSuggestionLabel(navItem)}
      </Button>
    ));
}
