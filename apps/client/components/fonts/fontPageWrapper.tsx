export const FontPageWrapper = ({ children, primary_font = 'Inter' }) => {
  return (
    <div
      style={{ fontFamily: `'${primary_font.replace(/_/g, ' ')}', sans-serif` }}
      className="flex min-h-screen flex-col"
    >
      {children}
    </div>
  );
};
