import { Button } from "ui";

import { IconEye, IconTools } from "./icons";
import { useBuilderContext } from "../context/context";

export const EditSwitch = () => {
  const { preview, setPreview } = useBuilderContext();
  return (
    <Button
      variant="primary"
      size="small"
      onClick={() => setPreview(!preview)}
      className="btn flex h-full flex-row items-center justify-end gap-1 px-4"
    >
      {preview ? (
        <>
          <IconTools size={18} stroke="#FFF" />
          Edit
        </>
      ) : (
        <>
          <IconEye size={18} stroke="#FFF" />
          Preview
        </>
      )}
    </Button>
  );
};
