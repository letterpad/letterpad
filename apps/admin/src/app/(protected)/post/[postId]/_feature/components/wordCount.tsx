import { useEffect, useState } from "react";
import { LinePlaceholder } from "ui";

export const WordCount = () => {
  const [visible, setVisible] = useState(true);
  const [words, setWords] = useState(0);
  const [characters, setCharacters] = useState(0);
  const [spacelessCharacters, setSpacelessCharacters] = useState(0);
  const [readingTime, setReadingTime] = useState(0);

  const editor = window["tinymce"]?.activeEditor;

  const [active, setActive] = useState(false);
  const storeStats = () => {
    const stats = WordCount.getStats();
    setWords(stats.words);
    setCharacters(stats.characters);
    setSpacelessCharacters(stats.spaceless_characters);
    setReadingTime(Math.ceil(stats.words / 200) ?? 0);
  };

  useEffect(() => {
    if (!editor || active) return;
    storeStats();
    editor?.on("SelectionChange", function (_e) {
      storeStats();
    });
    setActive(true);
  }, [active, editor]);

  if (!words) return null;
  return (
    <div className="fixed bottom-0 left-0 z-10 flex h-8 w-full cursor-pointer items-center justify-center rounded-md bg-white dark:bg-gray-800">
      {!editor ? (
        <LinePlaceholder />
      ) : (
        <a
          className="flex justify-center gap-4 text-sm  text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-300"
          onClick={(e) => {
            e.preventDefault();
            setVisible(!visible);
          }}
        >
          <span>{words} words</span>
          <span>{readingTime} min read</span>
          {visible && (
            <>
              <span>{characters} characters</span>
              <span className="hidden md:block">
                {spacelessCharacters} chars. without space
              </span>
            </>
          )}
        </a>
      )}
    </div>
  );
};

WordCount.getStats = () => {
  const editor = window["tinymce"]?.activeEditor;
  if (!editor) return {};
  const wordcountPlugin = editor?.plugins?.wordcount?.body;

  return {
    words: wordcountPlugin?.getWordCount(),
    characters: wordcountPlugin?.getCharacterCount(),
    spaceless_characters: wordcountPlugin?.getCharacterCountWithoutSpaces(),
  };
};
