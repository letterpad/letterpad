import { forwardRef } from "react";
import { WidgetPlaceholder } from "ui";

interface CountryChartProps {
  loading: boolean;
}

export const CountryChart = forwardRef<HTMLCanvasElement, CountryChartProps>(
  ({ loading }, ref) => {
    if (loading) return <WidgetPlaceholder className="w-full" />;
    return (
      <div className="flex flex-auto md:justify-center min-h-60 md:min-h-0">
        <div className="relative">
          <canvas ref={ref}></canvas>
        </div>
      </div>
    );
  }
);

CountryChart.displayName = "CountryChart";
