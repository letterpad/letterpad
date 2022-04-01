export const Spinner: React.VFC<{ width?: string }> = ({ width = 50 }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={width}
      style={{ background: "rgb(var(--content-bg))" }}
      viewBox="0 0 100 40"
      preserveAspectRatio="xMidYMid"
    >
      <rect x="15" y="10" width="10" height="20" fill="#e15b64">
        <animate
          attributeName="opacity"
          dur="1s"
          repeatCount="indefinite"
          calcMode="spline"
          keyTimes="0;0.5;1"
          keySplines="0.5 0 0.5 1;0.5 0 0.5 1"
          values="1;0.2;1"
          begin="-0.6"
        ></animate>
      </rect>
      <rect x="35" y="10" width="10" height="20" fill="#f47e60">
        <animate
          attributeName="opacity"
          dur="1s"
          repeatCount="indefinite"
          calcMode="spline"
          keyTimes="0;0.5;1"
          keySplines="0.5 0 0.5 1;0.5 0 0.5 1"
          values="1;0.2;1"
          begin="-0.4"
        ></animate>
      </rect>
      <rect x="55" y="10" width="10" height="20" fill="#f8b26a">
        <animate
          attributeName="opacity"
          dur="1s"
          repeatCount="indefinite"
          calcMode="spline"
          keyTimes="0;0.5;1"
          keySplines="0.5 0 0.5 1;0.5 0 0.5 1"
          values="1;0.2;1"
          begin="-0.2"
        ></animate>
      </rect>
      <rect x="75" y="10" width="10" height="20" fill="#abbd81">
        <animate
          attributeName="opacity"
          dur="1s"
          repeatCount="indefinite"
          calcMode="spline"
          keyTimes="0;0.5;1"
          keySplines="0.5 0 0.5 1;0.5 0 0.5 1"
          values="1;0.2;1"
          begin="-1"
        ></animate>
      </rect>
    </svg>
  );
};
