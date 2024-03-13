import './wave.css';

export function Wave() {
  return (
    <div className="absolute left-0 bottom-0 min-w-full bg-accent-900 print:hidden">
      <svg
        className="relative h-32 max-h-[150px] min-h-[100px] w-full"
        viewBox="0 24 150 28"
        preserveAspectRatio="none"
        shapeRendering="auto"
      >
        <defs>
          <path
            id="gentle-wave"
            d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
          />
        </defs>
        <g className="parallax">
          <use className="fill-gray-900/70" href="#gentle-wave" x="48" y="0" />
          <use className="fill-gray-900/50" href="#gentle-wave" x="48" y="3" />
          <use className="fill-gray-900/30" href="#gentle-wave" x="48" y="5" />
          <use className="fill-gray-900" href="#gentle-wave" x="48" y="7" />
        </g>
      </svg>
    </div>
  );
}
