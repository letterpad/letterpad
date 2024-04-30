"use server"

import { RegisterStep } from "letterpad-graphql";

import { prisma } from "@/lib/prisma";

import { createCustomer, createSubscriptionWithTrial } from "./lib/stripe";

export const createCustomerAndAddTrial = async (id: string) => {
    const author = await prisma.author.findUnique({
        where: { id },
    });
    if (!author) return null;
    const customer = await createCustomer({
        ...author,
        expires: "",
        register_step: author.register_step as RegisterStep,
        __typename: "SessionData",
    });
    if (customer?.id) {
        await createSubscriptionWithTrial({ customerId: customer.id });
    }
    return true;
};
