import Link from "next/link";

import Logo from "/public/website/logo.png";

function Footer() {
  return (
    <footer className="bg-white rounded-lg shadow dark:bg-neutral-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <div className="sm:flex sm:items-center sm:justify-between">
          <Link className="inline-flex" href="/" aria-label="Letterpad">
            <img
              className="mx-auto md:max-w-none"
              width={40}
              src={Logo.src}
              alt="Letterpad"
            />
          </Link>
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
            <li>
              <Link href="/terms" className="hover:underline me-4 md:me-6">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:underline me-4 md:me-6">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                target="_blank"
                className="text-gray-400 transition duration-150 ease-in-out hover:text-blue-500"
                href="https://github.com/letterpad/letterpad"
              >
                Contribute
              </Link>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-800 lg:my-8" />
        <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © 2024{" "}
          <a href="https://letterpad.app/" className="hover:underline">
            Letterpad
          </a>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
}

export default Footer;
