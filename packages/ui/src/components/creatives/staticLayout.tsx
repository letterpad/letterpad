import { Row } from "./components/row";
import { useBuilderContext } from "./context/context";


export const StaticLayout = () => {
  const { grid } = useBuilderContext();
  return (
    <>
      <div id="creative">
        <div className="flex flex-col">
          {grid.map((row, rowIndex) => {
            const isPrevRowImageLeft =
              grid[rowIndex - 1]?.data[0]?.type === "image";
            return (
              <Row
                isPrevRowImageLeft={isPrevRowImageLeft}
                row={row}
                key={row.id}
                rowIndex={rowIndex}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};
