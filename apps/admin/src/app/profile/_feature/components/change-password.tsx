import { useFormContext } from "react-hook-form";
import { Input } from "ui";

import { SaveButton } from "@/components/save-button";

import { ResetPasswordMutationVariables } from "@/graphql/queries/mutations.graphql";

interface Props {
  id: number;
}
export const ChangePassword: React.FC<Props> = ({ id }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<ResetPasswordMutationVariables>();

  return (
    <>
      <div className="grid grid-cols-12 items-end gap-2">
        <div className="col-span-10 lg:col-span-6">
          <Input
            label="Password"
            {...register("password", { required: true, minLength: 8 })}
            type="password"
          />
        </div>
        <SaveButton
          testId="basic-submit"
          disabled={!!errors.password}
          className="col-span-2 lg:col-span-1"
        />
      </div>
      <span className="-mt-4 text-sm text-red-500">
        {errors.password?.type === "minLength" &&
          "Should be minimum 8 characters long"}
      </span>
    </>
  );
};
