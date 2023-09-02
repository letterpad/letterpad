import { useRouter } from "next/router";
import useSWR from "swr";

import { fetchGetJSON } from "@/components/payments/utils";

const ResultPage = () => {
  const router = useRouter();

  const { data, error } = useSWR(
    router.query.session_id
      ? `/api/checkout_session/${router.query.session_id}`
      : null,
    fetchGetJSON
  );

  if (error) return <div>failed to load</div>;

  return (
    <div>
      <div className="page-container">
        <h1>Checkout Payment Result</h1>
        <h2>Status: {data?.payment_intent?.status ?? "loading..."}</h2>
        <h3>CheckoutSession response:</h3>
        <pre className="text-gray-300">
          {data ? JSON.stringify(data, null, 2) : "loading..."}
        </pre>
      </div>
    </div>
  );
};

export default ResultPage;
