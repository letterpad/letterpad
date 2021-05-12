import { SortableContainer } from "react-sortable-hoc";
import SortableItem from "./SortableItem";

const SortableList = ({ items, source, onChange, onRemove }) => {
  return (
    <div>
      {items.map((value, index: number) => (
        <div key={value.id} id={"item_" + value.id}>
          <SortableItem
            key={value.id}
            index={index}
            value={value}
            source={source}
            onChange={change => onChange(index, change)}
            onRemove={_e => {
              onRemove(index);
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default SortableContainer(SortableList);
