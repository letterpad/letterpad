"use client";

import { Metadata } from "next";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Website } from "../components/website";

const isPlatform = process.env.NEXT_PUBLIC_LETTERPAD_PLATFORM;

const Home = (p) => {
  const router = useRouter();
  useEffect(() => {
    if (!isPlatform) {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    document.body.classList.add("home");
    document.documentElement.classList.add("home");
    () => {
      document.body.classList.remove("home");
      document.documentElement.classList.remove("home");
    };
  }, []);

  if (isPlatform) {
    return (
      <>
        <Website />
      </>
    );
  }
  return null;
};

export default Home;
