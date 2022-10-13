import { FC, ReactNode } from "react";

import { PageType } from "@/graphql/types";

import { getMasonryLayout } from "./layouts/mazonry";
import { Item } from "./types";

interface Props {
  items: Item[];
  modal: ReactNode;
  onSelect: (index: number) => void;
  addItem: () => void;
  removeItem: (index: number) => void;
  layout: PageType;
  onSave: (i: number, data: Record<string, string>) => void;
}
export const PortfolioLayout: FC<Props> = ({
  items,
  modal,
  onSelect,
  addItem,
  removeItem,
  onSave,
}) => {
  const grid = getMasonryLayout(items, onSelect, removeItem, onSave);

  return (
    <div className="p-2 md:p-10 space-y-20">
      <button onClick={() => addItem()}>Add</button>
      <div className="page-layout">{grid}</div>
      <div className="modal">{modal}</div>
    </div>
  );
};
