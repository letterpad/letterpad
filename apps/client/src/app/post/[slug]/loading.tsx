'use client';

import { useEffect, useState } from 'react';

const Loading = (p) => {
  const [width, setWidth] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => {
      setWidth((width) => {
        if (width >= 90) {
          clearInterval(interval);
          return width;
        }
        return width + 0.5;
      });
    }, 5);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
      <div
        className="h-1.5 rounded-full bg-accent-50"
        style={{ transform: `translateX(${-100 + width}vw)` }}
      ></div>
    </div>
  );
};
export default Loading;
