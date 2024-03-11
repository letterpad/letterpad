"use client";

import { useSession } from "next-auth/react";

import { Banner } from "./banner";

export const SignupBanner = ({ hasSession }) => {
  return (
    <Banner
      title="What's your story today?"
      description=" Publish stories, build subscribers, follow other publishers and stay
      connected. Its free."
    >
      <div className="flex items-center">
        {!hasSession && (
          <a
            href={`/api/identity/login?source=${document.location.href}`}
            className="bg-blue-600 text-white font-semibold py-2.5 px-6 rounded hover:bg-blue-800 transition duration-300 ease-in-out"
          >
            Sign Up
          </a>
        )}
      </div>
    </Banner>
  );
};
