"use client";

import { useSession } from "next-auth/react"

export const useIsPaidMember = () => {
    const { status, data } = useSession();
    return status === "authenticated" && data?.user?.membership === "complete";
}