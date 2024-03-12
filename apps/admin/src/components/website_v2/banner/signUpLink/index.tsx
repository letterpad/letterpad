"use client";
import Link from "next/link";

export const SignupLink = () => {
  return (
    <div className="flex">
      <Link
        href={`/register?ref=hero-banner-become-author`}
        className="my-10 py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 bg-white rounded-lg"
      >
        Become an Author
      </Link>
    </div>
  );
};
