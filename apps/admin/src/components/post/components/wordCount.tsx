import { useEffect, useState } from "react";

export const WordCount = () => {
  const [visible, setVisible] = useState(false);
  const [words, setWords] = useState(0);
  const [characters, setCharacters] = useState(0);
  const [spacelessCharacters, setSpacelessCharacters] = useState(0);

  const editor = window["tinymce"]?.activeEditor;

  const [active, setActive] = useState(false);
  const storeStats = () => {
    const wordcountPlugin = editor?.plugins?.wordcount?.body;
    setWords(wordcountPlugin?.getWordCount());
    setCharacters(wordcountPlugin?.getCharacterCount());
    setSpacelessCharacters(wordcountPlugin?.getCharacterCountWithoutSpaces());
  };

  useEffect(() => {
    if (!editor || active) return;
    storeStats();
    editor?.on("SelectionChange", function (e) {
      storeStats();
    });
    setActive(true);
  }, [editor]);

  if (!editor) return null;

  return (
    <a
      className="fixed bottom-4 left-4 flex flex-col text-xs uppercase text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
      onClick={(e) => {
        e.preventDefault();
        setVisible(!visible);
      }}
    >
      <span>{words} words</span>
      {visible && (
        <>
          <span>{characters} characters</span>
          <span>{spacelessCharacters} chars. without space</span>
        </>
      )}
    </a>
  );
};
