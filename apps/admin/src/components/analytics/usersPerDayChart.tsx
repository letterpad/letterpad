import { forwardRef } from "react";
import { WidgetPlaceholder } from "ui";

interface UsersPerDayChartProps {
  loading: boolean;
}

export const UsersPerDayChart = forwardRef<
  HTMLCanvasElement,
  UsersPerDayChartProps
>(({ loading }, ref) => {
  if (loading) return <WidgetPlaceholder className="w-full" />;
  return (
    <div className="flex md:justify-center flex-auto min-h-60 md:min-h-0 min-w-0">
      <div className="relative md:min-w-[30rem] md:min-h-96">
        <canvas ref={ref}></canvas>
      </div>
    </div>
  );
});

UsersPerDayChart.displayName = "UsersPerDayChart";
