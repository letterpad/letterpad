import { Tooltip } from "@/components_v2/tooltip";

import { IconAdd } from "./icons";
import { useBuilderContext } from "../context";

export const Toolbar = ({ rowIndex }) => {
  const { addTextRow, addRow } = useBuilderContext();
  return (
    <Tooltip
      position="right"
      render={
        <p>
          <button
            className="icon-class rounded-l-md"
            onClick={() => addTextRow(rowIndex)}
          >
            Text
          </button>
          <button className="icon-class" onClick={() => addRow(rowIndex, 2)}>
            Split
          </button>
          <button
            className="icon-class rounded-r-md"
            onClick={() => addRow(rowIndex, 1)}
          >
            Full Width
          </button>
        </p>
      }
    >
      <button className="text-md my-10 flex flex-row items-center  gap-2 rounded-md">
        <IconAdd stroke="rgb(var(--color))" size={28} />
      </button>
    </Tooltip>
  );
};
