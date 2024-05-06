import { useFormContext } from "react-hook-form";
import { Input } from "ui";

import { SaveButton } from "@/components/save-button";

import { ResetPasswordMutationVariables } from "@/graphql/queries/mutations.graphql";

interface Props {
  id: string;
}
export const ChangePassword: React.FC<Props> = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<ResetPasswordMutationVariables>();

  return (
    <>
      <div className="gap-2 flex items-end">
        <div className="flex items-end flex-1 gap-2">
          <Input
            label="Password"
            {...register("password", { minLength: 8 })}
            type="password"
          />
          <SaveButton
            testId="basic-submit"
            disabled={!!errors.password}
            className=""
          />
        </div>
      </div>
      <span className="-mt-4 text-sm text-red-500">
        {errors.password?.type === "minLength" &&
          "Should be minimum 8 characters long"}
      </span>
    </>
  );
};
