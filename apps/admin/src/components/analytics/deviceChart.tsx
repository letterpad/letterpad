import { forwardRef } from "react";
import { WidgetPlaceholder } from "ui";

interface DeviceChartProps {
  loading: boolean;
}

export const DeviceChart = forwardRef<HTMLCanvasElement, DeviceChartProps>(
  ({ loading }, ref) => {
    if (loading) return <WidgetPlaceholder className="w-full" />;
    return (
      <div className="flex flex-auto md:justify-center max-h-80 min-w-0">
        <div className="relative">
          <canvas ref={ref}></canvas>
        </div>
      </div>
    );
  }
);

DeviceChart.displayName = "DeviceChart";
