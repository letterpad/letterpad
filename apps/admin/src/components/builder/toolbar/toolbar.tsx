import { Tooltip } from "@/components_v2/tooltip";

import { IconAdd } from "./icons";
import { useBuilderContext } from "../context";

export const Toolbar = () => {
  const { addTextRow, addRow } = useBuilderContext();
  return (
    <Tooltip
      render={
        <p>
          <button
            className="icon-class rounded-l-md"
            onClick={() => addTextRow()}
          >
            Text
          </button>
          <button className="icon-class" onClick={() => addRow(2)}>
            Split
          </button>
          <button className="icon-class rounded-r-md" onClick={() => addRow(1)}>
            Full Width
          </button>
        </p>
      }
    >
      <button className="icon-class text-md flex flex-row items-center  gap-2 rounded-md">
        <IconAdd /> <span>ADD</span>
      </button>
    </Tooltip>
  );
};
