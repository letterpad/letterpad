import { getServerSession } from "next-auth";

import { Faq } from "./faq";
import { PricingTable } from "./pricing-table";
import { options } from "../../../pages/api/auth/[...nextauth]";

const Pricing = async () => {
  const session = await getServerSession(options());
  const hasSession = session?.user?.id;
  return (
    <>
      <section className="bg-white dark:bg-gray-900">
        <div className="py-8 px-4 mx-auto max-w-screen-md lg:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
            <h2 className="mb-2 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white font-heading">
              Pricing
            </h2>
            <p className="mb-5 font-light text-gray-500 sm:text-xl dark:text-gray-400 font-heading">
              More creative tools, more freedom, and more flexibility.
            </p>
          </div>
          <PricingTable hasSession={hasSession} />
          <Faq />
        </div>
      </section>
    </>
  );
};
export default Pricing;
