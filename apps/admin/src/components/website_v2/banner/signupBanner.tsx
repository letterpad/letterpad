"use client";

import { Banner } from "./banner";

export const SignupBanner = ({ hasSession }) => {
  return (
    <Banner
      title="What's your story today?"
      description=" Publish stories, build subscribers, follow other publishers and stay
      connected."
    >
      <div className="flex items-center mt-10">
        {!hasSession && (
          <a
            href="/register?ref=start-now-btn"
            className="bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-800 transition duration-300 ease-in-out"
          >
            Start Now
          </a>
        )}
      </div>
    </Banner>
  );
};
