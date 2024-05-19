import { FC } from "react";
import { DialogModal } from "ui/dist/index.mjs";

import { AuthForm } from "./authForm";

interface Props {
  TriggerComponent: React.ReactNode;
  serviceUrl: string;
  source: string;
}

export const AuthModal: FC<Props> = ({
  TriggerComponent,
  serviceUrl,
  source,
}) => {
  return (
    <DialogModal
      trigger={TriggerComponent}
      type="trigger"
      contentClassName="w-full overflow-y-scroll bg-opacity-80"
    >
      <AuthForm serviceUrl={serviceUrl} source={source} />
    </DialogModal>
  );
};
