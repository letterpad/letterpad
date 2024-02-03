import { Metadata } from "next";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Website } from "../components/website_v2";

const Home = () => {
  return (
    <>
      <Website />
    </>
  );
};

export default Home;
