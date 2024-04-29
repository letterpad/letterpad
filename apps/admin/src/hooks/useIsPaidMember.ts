"use client";

import { useSession } from "next-auth/react"

export const useIsPaidMember = () => {
    const { status, data } = useSession();
    return status === "authenticated" && (data?.user?.membership === "complete" || data.user?.membership === "active" || data?.user?.membership === "profree" || data?.user?.membership === "trialing");
}

export const useIsPaidAndNotTrialMember = () => {
    const { status, data } = useSession();
    return status === "authenticated" && (data?.user?.membership === "complete" || data?.user?.membership === "profree");
}