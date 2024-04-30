"use client";

import { isCancel } from "axios";
import { useSession } from "next-auth/react"

export const useIsPaidMember = () => {
    const { status, data } = useSession();
    return status === "authenticated" && (data?.user?.membership === "complete" || data.user?.membership === "active" || data?.user?.membership === "profree" || data?.user?.membership === "trialing");
}

export const useIsPaidAndNotTrialMember = () => {
    const { status, data } = useSession();
    return status === "authenticated" && (data?.user?.membership === "complete" || data?.user?.membership === "profree");
}



export const useMembershipDetails = () => {
    const { status, data } = useSession();
    if (!data?.user || status !== "authenticated") {
        return null;
    }
    return {
        canStartTrial: data?.user?.can_start_trial,
        active: ["active", "profree", "trialing"].includes(data.user.membership),
        isProFree: data?.user?.membership === "profree",
        isTrialing: data?.user?.membership === "trialing",
        paymentDue: data.user.membership === "past_due",
        isCancelled: data.user.membership === "canceled"
    }
}