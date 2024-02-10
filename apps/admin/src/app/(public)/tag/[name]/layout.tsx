import { Metadata } from "next";

import Header from "../../../../components/header/Header";

export const metadata: Metadata = {
  title: "Tag",
};

const Layout = ({ children }) => {
  return (
    <>
      <div className="flex min-h-screen flex-col overflow-hidden dark:bg-gray-900 dark:text-gray-100 text-black/60">
        <Header />
        <main className="grow">
          <div className="flex flex-row max-w-6xl mx-auto px-4 sm:px-6 md:gap-8">
            <section className="w-full mb-5 flex flex-col overflow-hidden">
              {children}
            </section>
            <div className="hidden md:block md:ml-10 md:min-w-52 py-10">
              <section className="mb-10">
                <h3 className="font-bold text-lg pb-2">New Authors</h3>
              </section>
              <section className=""></section>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Layout;
