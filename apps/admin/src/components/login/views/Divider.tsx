export const DividerWithOr = () => {
  return (
    <>
      <div className="container">
        <hr className="w-full border-gray-300" />
        <span className="p-2 text-xs text-gray-400">OR</span>
        <hr className="w-full border-gray-300" />
      </div>
      <style jsx>{`
        .container {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .w-full {
          width: 100%;
        }
        .text-xs {
          font-size: 0.75rem;
          line-height: 1rem;
        }
        .p-2 {
          padding: 0.5rem;
        }
        .border-gray-300 {
          border: 1px solid rgb(var(--color-border));
        }
      `}</style>
    </>
  );
};
