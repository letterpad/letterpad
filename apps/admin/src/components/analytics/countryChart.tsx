import { forwardRef } from "react";
import { WidgetPlaceholder } from "ui";

interface CountryChartProps {
  loading: boolean;
}

export const CountryChart = forwardRef<HTMLCanvasElement, CountryChartProps>(
  ({ loading }, ref) => {
    if (loading) return <WidgetPlaceholder className="w-full" />;
    return (
      <div className="flex justify-center flex-1 min-h-60 md:min-h-0">
        <canvas ref={ref}></canvas>
      </div>
    );
  }
);

CountryChart.displayName = "CountryChart";
