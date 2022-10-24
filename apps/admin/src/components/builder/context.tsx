import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { createId } from "@/shared/utils";

import { Block, BlockItem } from "./types";

interface Props {
  children: ReactNode;
  data: Block[];
  onSave: (page_data: Block[]) => void;
}

interface ContextType {
  preview: boolean;
  setPreview: (preview: boolean) => void;
  setGrid: (data: Block[]) => void;
  grid: Block[];
  addRow: (rowIndex: number, columns?: number) => void;
  addMasonry: (rowIndex: number) => void;
  updateRow: (row: Block, rowIndex: number) => void;
  updateCell: (cell: BlockItem, rowIndex: number, colIndex: number) => void;
  removeCell: (rowIndex: number, colIndex?: number) => void;
  moveRow: (rowIndex: number, dir: "up" | "down") => void;
  swapColumns: (rowIndex: number) => void;
  getColumns: (rowIndex: number) => BlockItem[];
  addTextRow: (rowIndex: number) => void;
}

const Context = createContext<ContextType>({} as ContextType);

function createDefaultItem(): Block {
  return {
    id: createId(),
    columns: 1,
    data: [
      {
        text: "",
        type: "text",
      },
    ],
  };
}

export const BuilderContext: FC<Props> = ({ children, data, onSave }) => {
  const [preview, setPreview] = useState(false);

  const [grid, setGrid] = useState(data);

  useEffect(() => {
    setGrid(data);
  }, [data]);

  const removeCell = (index: number, col?: number) => {
    let gridCopy = [...grid];
    if (typeof col !== "undefined" && gridCopy[index].columns > 1) {
      const {
        data: [a, b],
      } = gridCopy[index];

      gridCopy[index] = {
        ...gridCopy[index],
        data: [col === 0 ? { ...b, type: "image" } : { ...a, type: "image" }],
        columns: 1,
        cover: "big",
      };
    } else {
      gridCopy = gridCopy.filter((_, idx) => idx !== index);
    }
    setGrid(gridCopy);
    onSave(gridCopy);
  };

  const addRow = useCallback(
    (rowIndex, columns = 2) => {
      const isPrevRowImageLeft =
        grid[grid.length - 1].data[0]?.type === "image";
      const newItem = { ...createDefaultItem() };

      if (columns === 1) {
        newItem.data = [{ type: "image" }];
        const newGrid: Block[] = [
          ...grid.slice(0, rowIndex + 1),
          { ...newItem, columns: 1 },
          ...grid.slice(rowIndex + 1),
        ];
        return setGrid(newGrid);
      }

      if (isPrevRowImageLeft) {
        newItem.data = [{ type: "text" }, { type: "image" }];
      } else {
        newItem.data = [{ type: "image" }, { type: "text" }];
      }
      const newGrid: Block[] = [
        ...grid.slice(0, rowIndex + 1),
        { ...newItem, columns: 2 },
        ...grid.slice(rowIndex + 1),
      ];
      setGrid(newGrid);
    },
    [grid],
  );

  const addMasonry = useCallback(
    (rowIndex) => {
      const newItem = { ...createDefaultItem() };
      newItem.data = [{ type: "masonry" }];
      const newGrid: Block[] = [
        ...grid.slice(0, rowIndex + 1),
        { ...newItem, columns: 1, cover: "big" },
        ...grid.slice(rowIndex + 1),
      ];
      return setGrid(newGrid);
    },
    [grid],
  );

  const addTextRow = (rowIndex: number) => {
    const newItem = { ...createDefaultItem() };
    const newGrid: Block[] = [
      ...grid.slice(0, rowIndex + 1),
      { ...newItem, columns: 1, cover: "banner" },
      ...grid.slice(rowIndex + 1),
    ];
    setGrid(newGrid);
    onSave(newGrid);
  };

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
    setGrid([...grid]);
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

  useEffect(() => {
    if (grid.length === 0) {
      setGrid([...grid, { ...createDefaultItem(), cover: "big" }]);
    }
  }, [addRow, grid]);

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
    setGrid,
    addMasonry,
    getColumns: (rowIndex: number) => grid[rowIndex].data,
    addTextRow,
  };
  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useBuilderContext = () => useContext(Context);
