import { useRouter } from "next/router";
import { useEffect } from "react";

const NoPage = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/posts");
  });

  return null;
};

export default NoPage;
