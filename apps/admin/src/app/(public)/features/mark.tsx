export const Mark = ({ children }) => {
  return (
    <span
      className="text-blue-500 font-semibold dark:text-blue-300"
      style={{ WebkitTextFillColor: "#3b82f6" }}
    >
      {children}
    </span>
  );
};
