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
    <div className="flex justify-center flex-1 min-h-60 md:min-h-0 md:w-full">
      <canvas ref={ref} style={{ height: 300 }}></canvas>
    </div>
  );
});

UsersPerDayChart.displayName = "UsersPerDayChart";
