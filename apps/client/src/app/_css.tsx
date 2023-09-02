'use client';

export const Css = ({ css }) => {
  return (
    <>
      <style jsx global>
        {`
          ${css}
        `}
      </style>
    </>
  );
};
