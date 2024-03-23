import { Setting } from "letterpad-graphql";
import { useFormContext } from "react-hook-form";
import { TextArea } from "ui";

interface Props {}
const Ai: React.FC<Props> = () => {
  const data = useFormContext<Setting>();

  return (
    <>
      <div className="mb-8 w-full gap-8 flex flex-col">
        <span className="max-w-2xl">
          To get an OpenAI key, you first need to register at{" "}
          <a
            href="https://platform.openai.com/login?launch"
            target="_blank"
            rel="noreferrer"
            className="text-blue-500"
          >
            Open AI
          </a>
          . Once you have registered and logged in, you can create a new secret
          key from{" "}
          <a
            href="https://platform.openai.com/api-keys"
            target="_blank"
            rel="noreferrer"
            className="text-blue-500"
          >
            API keys
          </a>
          . Copy the key and paste it here.
        </span>
        <div className="mb-8 flex flex-1 items-center">
          <TextArea
            label="Open AI Key"
            {...data.register("openai_key", {
              maxLength: 300,
            })}
            id="openai_key"
            rows={2}
            className="w-96"
            cols={100}
          />
        </div>
      </div>
    </>
  );
};
export default Ai;
