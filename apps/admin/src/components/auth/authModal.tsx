import { FC } from "react";
import { DialogModal } from "ui/dist/index.mjs";

import { AuthForm } from "./authForm";

interface Props {
  TriggerComponent: React.ReactNode;
  source: string;
  view?: "login" | "register";
}

export const AuthModal: FC<Props> = ({
  TriggerComponent,
  source,
  view = "login",
}) => {
  return (
    <DialogModal
      trigger={TriggerComponent}
      type="trigger"
      contentClassName="w-full overflow-y-scroll bg-opacity-80"
    >
      <AuthForm
        source={source}
        view={view}
        border={false}
        changeRouteOnViewChange={false}
      />
    </DialogModal>
  );
};
