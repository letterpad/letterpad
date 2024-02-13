import { getServerSession } from "next-auth";

import { options } from "../../pages/api/auth/[...nextauth]";

export const Banner = async () => {
  const data = await getServerSession(options());

  return (
    <div className="w-full py-20 bg-black text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 justify-between flex-col md:flex-row flex md:items-center md:space-y-0 space-y-10">
        <div className="">
          <h2 className="text-3xl font-bold mb-4">What's your story today?</h2>
          <p className="text-lg">
            Publish stories, build subscribers, follow other publishers and stay
            connected. Its free.
          </p>
        </div>
        {!data?.user?.username && (
          <div className="flex items-center">
            <a
              href="#"
              className="bg-blue-600 text-white font-semibold py-2.5 px-6 rounded hover:bg-blue-800 transition duration-300 ease-in-out"
            >
              Sign Up
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
