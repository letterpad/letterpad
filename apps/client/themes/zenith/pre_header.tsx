const rectanglesData = Array.from({ length: 100 }, () => ({
  height: `${Math.random() * 60 + 40}%`,
})).map((rect, index) => ({
  ...rect,
  x: index * 4,
}));

export function PreHeader() {
  return (
    <svg aria-hidden="true" className="absolute left-0 top-0 h-20 w-full">
      <defs>
        <linearGradient id=":S1:-fade" x1="0" x2="0" y1="0" y2="1">
          <stop offset="40%" stopColor="white"></stop>
          <stop offset="100%" stopColor="black"></stop>
        </linearGradient>
        <linearGradient id=":S1:-gradient">
          <stop offset="0%" stopColor="#4989E8"></stop>
          <stop offset="50%" stopColor="#6159DA"></stop>
          <stop offset="100%" stopColor="#FF54AD"></stop>
        </linearGradient>
        <mask id=":S1:-mask">
          <rect width="100%" height="100%" fill="url(#:S1:-pattern)"></rect>
        </mask>
        <pattern
          id=":S1:-pattern"
          width="400"
          height="100%"
          patternUnits="userSpaceOnUse"
        >
          {rectanglesData.map((rect, index) => (
            <rect
              key={index}
              width="2"
              height={rect.height}
              x={rect.x}
              fill="url(#:S1:-fade)"
            ></rect>
          ))}
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        fill="url(#:S1:-gradient)"
        mask="url(#:S1:-mask)"
        opacity="0.25"
      ></rect>
    </svg>
  );
}
