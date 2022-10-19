import Script from 'next/script';

const UmamiScript = ({ id }) => {
  return (
    <>
      <Script async defer data-website-id={id} src="https://collect.letterpad.app/umami.js" />
    </>
  );
};

export default UmamiScript;
