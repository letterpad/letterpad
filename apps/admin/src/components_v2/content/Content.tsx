export const Content = ({ children }) => {
  return (
    <div className="flex w-full flex-1 p-4 text-base">
      <div className="flex-1">{children}</div>
    </div>
  );
};
