import { IconEye, IconTools } from "./icons";
import { useBuilderContext } from "../context";

export const EditSwitch = () => {
  const { preview, setPreview } = useBuilderContext();
  return (
    <a
      onClick={() => setPreview(!preview)}
      className="m-4 flex flex-row items-center justify-end"
    >
      {preview ? (
        <IconTools size={26} stroke="rgb(var(--color))" />
      ) : (
        <IconEye size={26} stroke="rgb(var(--color))" />
      )}
    </a>
  );
};
