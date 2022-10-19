const WordCount: React.VFC<{ text: string }> = ({ text }) => {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 10,
        left: 10,
      }}
    >
      {text.split(" ").length} words
    </div>
  );
};

export default WordCount;
