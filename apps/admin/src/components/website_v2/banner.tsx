import { getServerSession } from "next-auth";

import Particles from "./particles/particles";
import { options } from "../../pages/api/auth/[...nextauth]";

export const Banner = async () => {
  const data = await getServerSession(options());

  return (
    <div className="w-full py-20 bg-black text-white relative">
      <Particles
        className="absolute inset-0 pointer-events-none"
        quantity={150}
      />
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

// import { getServerSession } from "next-auth";

// import Particles from "./particles/particles";
// import { options } from "../../pages/api/auth/[...nextauth]";

// export const Banner = async () => {
//   const data = await getServerSession(options());

//   return (
//     <div className="w-full bg-black text-white relative">
//       <div className="flex justify-between  max-w-6xl mx-auto py-10 px-4">
//         <div className="py-60 flex-1 ">
//           <Particles
//             className="absolute inset-0 pointer-events-none"
//             quantity={250}
//           />
//           <div className="justify-between text-white  flex-col md:flex-row flex md:items-center md:space-y-0 space-y-10">
//             <div className="">
//               <h2 className="text-3xl font-bold mb-2">
//                 What's your story today?
//               </h2>
//               <p className="text-md hidden">
//                 Publish stories, build subscribers, follow other publishers and
//                 stay connected. Its free.
//               </p>
//             </div>
//           </div>
//         </div>
//         <div className="z-10 flex-1 justify-center flex items-center w-full bg-slate-800 rounded-lg font-heading">
//           <div className="p-12 ">
//             <h1 className="text-3xl font-extrabold">
//               Share your stories and support Authors
//             </h1>
//             <p className="text-md mt-4">
//               Letterpad offers a versatile platform where you can share your
//               stories, build an audience, and make money.
//             </p>
//             <div>
//               {!data?.user?.username ? (
//                 <button
//                   type="button"
//                   className="my-10 py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 bg-white rounded-lg"
//                 >
//                   Become an Author
//                 </button>
//               ) : (
//                 <div className="py-5" />
//               )}
//             </div>
//             <h3 className="text-xl font-bold my-4">Why choose Letterpad?</h3>
//             <ul className="flex flex-col gap-2 text-slate-200">
//               <li>✓ Easy-to-use story creation tools</li>
//               <li>✓ Earn money from reads</li>
//               <li>✓ Build your audience</li>
//               <li>✓ Customise your brand</li>
//               <li>✓ No annoying ads</li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
