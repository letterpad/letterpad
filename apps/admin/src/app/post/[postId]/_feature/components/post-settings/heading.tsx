export const Heading = ({ heading, subheading }) => {
  return (
    <>
      <label className="font-bold">{heading}</label>
      <p className="help-text mb-4 mt-2">{subheading}</p>
    </>
  );
};
