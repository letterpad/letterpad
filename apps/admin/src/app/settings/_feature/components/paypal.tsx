import { Setting } from "letterpad-graphql";
import { useFormContext } from "react-hook-form";
import { Input } from "ui";

interface Props {}
const Paypal: React.FC<Props> = () => {
  const data = useFormContext<Setting>();

  return (
    <>
      <div className="mb-8 flex flex-col gap-8">
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
    </>
  );
};
export default Paypal;
