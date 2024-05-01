import { getServerSession } from "next-auth";

import { Faq } from "./faq";
import { PricingTable } from "./pricing-table";
import { Banner } from "../../../components/website_v2/banner/banner";
import { options } from "../../../pages/api/auth/[...nextauth]";

const Pricing = async () => {
  const session = await getServerSession(options());
  const hasSession = session?.user?.id;
  return (
    <>
      <section>
        <Banner
          title={"Pricing"}
          description={
            "More creative tools, AI assistant, advanced analytics and much more."
          }
        />
        <div className="py-8 px-4 mx-auto max-w-screen-md lg:py-16 lg:px-6 flex flex-col gap-20">
          <PricingTable hasSession={hasSession} />
          <Faq />
        </div>
      </section>
    </>
  );
};
export default Pricing;
