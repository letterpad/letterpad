import { useEffect, useState } from "react";

const WordCount: React.VFC<{ text: string }> = ({ text }) => {
  const [visible, setVisible] = useState(false);
  if (!window["tinymce"]?.activeEditor) return null;

  const { getWordCount, getCharacterCount, getCharacterCountWithoutSpaces } =
    window["tinymce"]?.activeEditor.plugins.wordcount.body ?? {};

  return (
    <a
      className="fixed bottom-4 left-4 flex flex-col text-xs uppercase text-gray-500 hover:text-gray-900 dark:bg-black"
      onClick={(e) => {
        e.preventDefault();
        setVisible(!visible);
      }}
    >
      <span>{getWordCount()} words</span>
      {visible && (
        <>
          <span>{getCharacterCount()} characters</span>
          <span>{getCharacterCountWithoutSpaces()} chars. without space</span>
        </>
      )}
    </a>
  );
};

export default WordCount;
