import { createContext, FC, ReactNode, useContext, useState } from "react";

import { Block, BlockItem } from "./types";

interface Props {
  children: ReactNode;
  data: Block[];
  onSave: (page_data: Block[]) => void;
}

interface ContextType {
  preview: boolean;
  setPreview: (preview: boolean) => void;
  grid: Block[];
  addRow: () => void;
  updateRow: (row: Block, rowIndex: number) => void;
  updateCell: (cell: BlockItem, rowIndex: number, colIndex: number) => void;
  removeCell: (rowIndex: number, colIndex?: number) => void;
  moveRow: (rowIndex: number, dir: "up" | "down") => void;
  swapColumns: (rowIndex: number) => void;
  getColumns: (rowIndex: number) => BlockItem[];
}

const Context = createContext<ContextType>({} as ContextType);
const defaultItem: Block = {
  columns: 1,
  data: [
    {
      text: "",
      type: "image",
    },
  ],
};

export const BuilderContext: FC<Props> = ({ children, data, onSave }) => {
  const [preview, setPreview] = useState(false);
  const [grid, setGrid] = useState(data);

  const removeCell = (index: number, col?: number) => {
    let gridCopy = [...grid];
    if (typeof col !== "undefined" && gridCopy[index].columns > 1) {
      gridCopy[index].columns -= 1;
      delete gridCopy[index].data[col];
    } else {
      gridCopy = gridCopy.filter((_, idx) => idx !== index);
    }
    setGrid(gridCopy);
    onSave(gridCopy);
  };

  const addRow = () => setGrid((grid) => [...grid, defaultItem]);

  const updateRow = (change: Block, rowIndex: number) => {
    const newGrid = grid.map((item, idx) => {
      return idx === rowIndex ? change : item;
    });
    setGrid(newGrid);
    onSave(newGrid);
  };

  const updateCell = (cell: BlockItem, rowIndex: number, colIndex: number) => {
    const data = { ...grid[rowIndex].data[colIndex] };
    const resetBlock = Object.keys(cell).length === 0;
    grid[rowIndex].data[colIndex] = resetBlock
      ? { type: cell.type }
      : { ...data, ...cell };
    setGrid(grid);
    onSave(grid);
  };

  const moveRow = (rowIndex: number, dir: "up" | "down") => {
    const gridCopy = [...grid];

    if (dir === "up") {
      if (rowIndex === 0) return;
      const temp = gridCopy[rowIndex - 1];
      gridCopy[rowIndex - 1] = gridCopy[rowIndex];
      gridCopy[rowIndex] = temp;
    } else if (dir === "down") {
      if (rowIndex === grid.length - 1) return;
      const temp = gridCopy[rowIndex + 1];
      gridCopy[rowIndex + 1] = gridCopy[rowIndex];
      gridCopy[rowIndex] = temp;
    }
    setGrid(gridCopy);
    onSave(gridCopy);
  };

  const swapColumns = (rowIndex: number) => {
    const gridCopy = grid.map((item, idx) => {
      if (idx === rowIndex) {
        return { ...item, data: item.data.reverse() };
      }
      return item;
    });
    setGrid(gridCopy);
    onSave(gridCopy);
  };

  const value = {
    preview,
    setPreview,
    grid,
    addRow,
    updateRow,
    removeCell,
    moveRow,
    swapColumns,
    updateCell,
    getColumns: (rowIndex: number) => grid[rowIndex].data,
  };
  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useBuilderContext = () => useContext(Context);
