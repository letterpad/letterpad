import { Session } from "next-auth";
import { useEffect } from "react";

export const useErrorReporting = (user?: Session["user"]) => {
  useEffect(() => {
    if (user?.email && user?.name && typeof window.rg4js !== "undefined") {
      window.rg4js("setUser", {
        //@ts-ignore
        identifier: user?.id,
        isAnonymous: false,
        email: user?.email,
        fullName: user?.name,
      });
    }
  }, [user]);
};
