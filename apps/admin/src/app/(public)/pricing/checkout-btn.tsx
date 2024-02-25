"use client";
import { FC } from "react";

import { checkout } from "../../membership/checkout";

interface Props {
  label: string;
  role: "checkout" | "register";
}

export const CheckoutButton: FC<Props> = ({ label, role }) => {
  const onClick = async (e) => {
    e.preventDefault();
    if (role === "checkout") {
      checkout();
    } else if (role === "register") {
      window.location.href = "/register?sourcePage=pricing";
    }
  };

  return (
    <a
      href="#"
      onClick={onClick}
      className="text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2 text-center dark:text-white  dark:focus:ring-primary-900"
    >
      {label}
    </a>
  );
};
