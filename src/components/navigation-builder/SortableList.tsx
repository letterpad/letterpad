import { SortableContainer } from "react-sortable-hoc";

import { EventAction, track } from "@/track";

import SortableItem from "./SortableItem";

const SortableList = ({ items, source, onChange, onRemove }) => {
  return (
    <div style={{ padding: "20px 0" }}>
      {items.map((value, index: number) => (
        <div key={value.id} id={"item_" + value.id}>
          <SortableItem
            key={value.id}
            index={index}
            value={value}
            source={source}
            onChange={(change) => {
              track({
                eventAction: EventAction.Change,
                eventCategory: "navigation",
                eventLabel: "sort",
              });
              onChange(index, change);
            }}
            onRemove={(_e) => {
              track({
                eventAction: EventAction.Click,
                eventCategory: "navigation",
                eventLabel: "remove-item",
              });
              onRemove(index);
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default SortableContainer(SortableList);
