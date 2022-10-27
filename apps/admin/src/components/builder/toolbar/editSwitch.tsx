import { Buttonv2 } from "@/components_v2/button";

import { IconEye, IconTools } from "./icons";
import { useBuilderContext } from "../context";

export const EditSwitch = () => {
  const { preview, setPreview } = useBuilderContext();
  return (
    <Buttonv2
      variant="dark"
      size="small"
      onClick={() => setPreview(!preview)}
      className="btn flex h-full flex-row items-center justify-end gap-1 px-4"
    >
      {preview ? (
        <>
          <IconTools size={26} stroke="#FFF" />
          Edit
        </>
      ) : (
        <>
          <IconEye size={26} stroke="#FFF" />
          Preview
        </>
      )}
    </Buttonv2>
  );
};
