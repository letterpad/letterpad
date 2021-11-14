import { Editor } from "letterpad-editor";
import dynamic from "next/dynamic";
// import { mdToHtml } from "src/shared/converter";
import { memo, useRef } from "react";
import { usePostContext } from "../context";

const LetterpadEditor = dynamic(() => import("letterpad-editor"), {
  ssr: false,
});

interface Props {
  text: string;
}

const LpEditor: React.FC<Props> = ({ text }) => {
  const { setHelpers, onMediaBrowse, setPostAttribute } = usePostContext();
  const editorRef = useRef<Editor>(null);
  return (
    <>
      <LetterpadEditor
        dark={localStorage.theme === "dark"}
        onImageClick={onMediaBrowse}
        html={text}
        onChange={(html) =>
          html !== text && setPostAttribute && setPostAttribute({ html })
        }
        placeholder="Write a story.."
        setHelpers={setHelpers}
        editorRef={editorRef}
      />
      <style jsx global>{`
        .block-toolbar span span {
          display: block;
        }
      `}</style>
    </>
  );
};

export default memo(LpEditor);
