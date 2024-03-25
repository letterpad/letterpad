"use client";
import { FC, useState } from "react";
import { VscLoading } from "react-icons/vsc";
import { Button } from "ui";

import { checkout } from "../../membership/checkout";

interface Props {
  freePlan?: boolean;
  label: string;
  hasSession: boolean;
}

export const CheckoutButton: FC<Props> = ({ label, freePlan, hasSession }) => {
  const [loading, setLoading] = useState(false);

  const onClick = async (e) => {
    e.preventDefault();
    if (freePlan && !hasSession) {
      window.location.href = "/register?sourcePage=pricing";
      return;
    }
    setLoading(true);
    try {
      if (hasSession) {
        await checkout();
      } else {
        window.location.href = "/register?sourcePage=pricing";
      }
    } catch (e) {
      //
    }
    setLoading(false);
  };

  return (
    <Button
      onClick={onClick}
      variant={"success"}
      size="small"
      className="flex items-center gap-2"
      disabled={loading}
    >
      {loading && <VscLoading />} <span>{label}</span>
    </Button>
  );
};
