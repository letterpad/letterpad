'use client';
import { GoTools } from 'react-icons/go';
import { IoIosArrowRoundBack } from 'react-icons/io';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-100 p-4 text-base">
      <div className="flex h-[calc(100vh-80px)] w-full items-center justify-center bg-white p-5">
        <div className="text-center">
          <div className="inline-flex rounded-full bg-gray-200 p-4">
            <div className="rounded-full bg-gray-400  p-4">
              <GoTools size={40} />
            </div>
          </div>
          <h1 className="mt-5 text-[36px] font-bold text-slate-800 lg:text-[50px]">
            Server error
          </h1>
          <p className="mt-5 text-slate-600 lg:text-lg">
            Oops something went wrong. Try to refresh this page or <br /> feel
            free to contact us if the problem presists. <br />
            <a href="mailto:admin@letterpad.app" className="text-green-500">
              admin@letterpad.app
            </a>
          </p>
          <p className="mt-4">
            <button className="button button-primary ">
              <a href="/" className="justify-cente flex items-center">
                <IoIosArrowRoundBack size={30} /> <span>Back To Home</span>
              </a>
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
