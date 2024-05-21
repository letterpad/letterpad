import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

import { getServerSession } from "@/graphql/context";

export async function GET(req: Request) {
    const session = await getServerSession();
    if (!session?.user.email) {
        return NextResponse.json({ active: false, error: "You are not authorized" }, { status: 401 });
    }

    const author = await prisma.membership.findFirst({
        where: {
            author: {
                id: session.user.id
            },
        },
    });
    if (author?.status === "profree") {
        return NextResponse.json({ active: true, status: author.status }, { status: 200 });
    }
    if (!author || !author.stripe_customer_id) {
        return NextResponse.json({ active: false }, { status: 200 });
    }

    const details = async () => {
        const customer = await stripe.customers.retrieve(
            author.stripe_customer_id!,
            {
                expand: ["subscriptions"], // 2
            }
        );
        if (!customer.deleted) {
            const charges = await stripe.charges.list({
                customer: author?.stripe_customer_id!,
                limit: 3,
            });
            let invoice;
            if (customer?.subscriptions?.data[0]?.latest_invoice) {
                invoice = await stripe.invoices.retrieve(customer?.subscriptions?.data[0].latest_invoice as string)
            }
            return { customer, charges, invoice };
        }

        return { customer: null, charges: null, invoice: null };
    };
    const { customer, charges, invoice } = await details();
    const active = customer?.subscriptions?.data[0]?.status === "active";
    return NextResponse.json({ customer, charges, active, invoice }, { status: 200 });
}
