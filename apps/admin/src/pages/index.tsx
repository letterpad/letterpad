import { useRouter } from "next/router";
import { useEffect } from "react";

import { Website } from "../components/website";

const isPlatform = process.env.NEXT_PUBLIC_LETTERPAD_PLATFORM;
const NoPage = () => {
  const router = useRouter();
  useEffect(() => {
    if (!isPlatform) {
      router.push("/login");
    }
  }, [router]);

  if (isPlatform) {
    return <Website />;
  }
  return null;
};

NoPage.isPublic = true;
export default NoPage;
