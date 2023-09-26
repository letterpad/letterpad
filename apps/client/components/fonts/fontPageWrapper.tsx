export const FontPageWrapper = ({
  children,
  primary_font = 'Inter',
  secondary_font = 'PT_Serif',
}) => {
  return (
    <div
      style={{ fontFamily: `'${primary_font.replace(/_/g, ' ')}'` }}
      className="flex min-h-screen flex-col"
    >
      {children}
    </div>
  );
};
