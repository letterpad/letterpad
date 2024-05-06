export const Heading = ({ heading, subheading }) => {
  return (
    <>
      <label className="font-bold text-md">{heading}</label>
      <p className="help-text mb-4 mt-2">{subheading}</p>
    </>
  );
};
