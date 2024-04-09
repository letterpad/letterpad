import { RxOpenInNewWindow } from "react-icons/rx";
import { Button } from "ui";

interface Props {}
const Ai: React.FC<Props> = () => {
  return (
    <>
      <div className="mb-8 w-full gap-8 flex flex-col">
        We have made the AI feature more powerful and is now available in the
        Pro Plan. If you are interested in using this feature, please upgrade.
        <Button
          onClick={() => {
            window.open("/membership", "_blank");
          }}
          className="flex gap-1 items-center justify-center"
        >
          Pro Plan <RxOpenInNewWindow />
        </Button>
      </div>
    </>
  );
};
export default Ai;
