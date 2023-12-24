import { useFormContext } from "react-hook-form";
import { TextArea } from "ui";

import { SaveButton } from "@/components/save-button";

import { Setting } from "@/__generated__/__types__";

interface Props {}
const Ai: React.FC<Props> = () => {
  const data = useFormContext<Setting>();

  return (
    <>
      <div className="mb-8 grid w-full grid-cols-1 gap-8">
        <div className="mb-8 flex flex-1 items-center">
          <TextArea
            label="Open AI Key"
            {...data.register("openai_key", {
              required: true,
              maxLength: 300,
            })}
            id="client_token"
            rows={2}
            className="w-96"
            cols={100}
          />
        </div>
      </div>
      <SaveButton testId="save-general" />
    </>
  );
};
export default Ai;
