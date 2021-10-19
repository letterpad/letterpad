import dynamic from "next/dynamic";
import { mdToHtml } from "src/shared/converter";
import { memo } from "react";
import { usePostContext } from "../context";

const LetterpadEditor = dynamic(() => import("letterpad-editor"), {
  ssr: false,
});

interface Props {
  text: string;
}

const Editor: React.FC<Props> = ({ text }) => {
  const { setHelpers, onMediaBrowse, setPostAttribute } = usePostContext();
  return (
    <>
      <LetterpadEditor
        dark={localStorage.theme === "dark"}
        onImageClick={onMediaBrowse}
        html={mdToHtml(text)}
        onChange={(html) =>
          setPostAttribute && setPostAttribute({ html, md: "# hello" })
        }
        placeholder="Write a story.."
        setHelpers={setHelpers}
      />
      <style jsx global>{`
        .block-toolbar span span {
          display: block;
        }
      `}</style>
    </>
  );
};

export default memo(Editor);
