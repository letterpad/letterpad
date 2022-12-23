import { NextApiResponse } from "next";

import { stripe } from "@/lib/stripe";

import { NextApiRequestWithFormData } from "./../../graphql/types";

const CancelSubscription = async (
  req: NextApiRequestWithFormData,
  res: NextApiResponse
) => {
  try {
    const subscription_id = req.body.subscription_id as string;

    const response = await stripe.subscriptions.del(subscription_id);

    res.send(JSON.stringify(response));
  } catch (e: any) {
    res.send(e.message);
  }
};

export default CancelSubscription;
