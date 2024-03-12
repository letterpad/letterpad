import { useFormContext } from "react-hook-form";
import { Input, TextArea } from "ui";

import { SaveButton } from "@/components/save-button";

import { Setting } from "@/__generated__/__types__";

interface Props {}
const Paypal: React.FC<Props> = () => {
  const data = useFormContext<Setting>();

  return (
    <>
      <div className="mb-8 grid w-full grid-cols-1 gap-8">
        <div className="mb-8 flex flex-1 gap-10 flex-col">
          <div className="font-heading">
            We will trasfer your earning to this account. Please make sure to
            add the correct email id.
          </div>
          <Input
            label="Paypal email id"
            {...data.register("paypal_email", {
              maxLength: 100,
            })}
            id="paypal_email"
            className="w-96"
            type="email"
          />
        </div>
      </div>
      <SaveButton testId="save-paypal" />
    </>
  );
};
export default Paypal;
