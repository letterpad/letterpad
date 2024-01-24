import ThemeSwitcher from "../../components/theme-switcher";
import Footer from "../../components/website/Footer";
import Header from "../../components/website/Header";

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <nav className="hidden">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-6">
          <a
            href="https://letterpad.app/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img src="/logo/logo.png" className="h-8" alt="Letterpad" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Letterpad
            </span>
          </a>

          <div className="w-full md:block md:w-auto" id="navbar-default">
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg  md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0  dark:border-gray-700">
              <li>
                <a
                  href="#"
                  className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500"
                  aria-current="page"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >
                  About
                </a>
              </li>
              <ThemeSwitcher />
            </ul>
          </div>
        </div>
      </nav>

      <div>{children}</div>
      <Footer />
    </>
  );
};

export default Layout;
