import { forwardRef } from "react";

interface CountryChartProps {
  // Define props here
}

export const CountryChart = forwardRef<HTMLCanvasElement, CountryChartProps>(
  (props, ref) => {
    return (
      <div className="flex justify-center flex-1 min-h-60 md:min-h-0">
        <canvas ref={ref}></canvas>
      </div>
    );
  }
);

CountryChart.displayName = "CountryChart";
