"use server"
import { prisma } from "@/lib/prisma";

import { createCustomer, createSubscriptionWithTrial } from "./lib/stripe";

export const createCustomerAndAddTrial = async (id: string) => {
    const author = await prisma.author.findUnique({
        where: { id },
    });
    if (!author) return null;
    const customer = await createCustomer({
        ...author,
    });
    if (customer?.id) {
        await createSubscriptionWithTrial({ customerId: customer.id });
    }
    return true;
};
