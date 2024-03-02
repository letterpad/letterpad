import { forwardRef } from "react";
import { WidgetPlaceholder } from "ui";

interface DeviceChartProps {
  loading: boolean;
}

export const DeviceChart = forwardRef<HTMLCanvasElement, DeviceChartProps>(
  ({ loading }, ref) => {
    if (loading) return <WidgetPlaceholder className="w-full" />;
    return (
      <div className="flex justify-center flex-1 max-h-80">
        <canvas ref={ref}></canvas>
      </div>
    );
  }
);

DeviceChart.displayName = "DeviceChart";
