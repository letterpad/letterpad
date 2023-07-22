import Link from "next/link";

import Logo from "/public/website/logo.png";

function Footer() {
  return (
    <footer>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Blocks */}
        <div className="grid gap-8 py-8 sm:grid-cols-12 md:py-12">
          {/* 1st block */}
          <div className="sm:col-span-12 lg:col-span-4 lg:max-w-xs">
            <div className="mb-2">
              {/* Logo */}
              <Link className="inline-flex" href="/" aria-label="Letterpad">
                <img
                  className="mx-auto md:max-w-none"
                  width={40}
                  src={Logo.src}
                  alt="Letterpad"
                />
              </Link>
            </div>
            <div className="text-sm text-gray-600">
              {/* <a className="text-gray-400 hover:text-blue-500 transition duration-150 ease-in-out" href="#0">Terms</a> · <a className="text-gray-400 hover:text-blue-500 transition duration-150 ease-in-out" href="#0">Privacy Policy</a> */}
            </div>
          </div>
          {/* 2nd block */}
          <div className="sm:col-span-6 md:col-span-3 lg:col-span-2"></div>
          {/* 3rd block */}
          <div className="sm:col-span-6 md:col-span-3 lg:col-span-2"></div>
          {/* 4th block */}
          <div className="sm:col-span-6 md:col-span-3 lg:col-span-2"></div>
          {/* 5th block */}
          <div className="sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h6 className="mb-2 text-xs font-semibold uppercase text-gray-200">
              Company
            </h6>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  className="text-gray-400 transition duration-150 ease-in-out hover:text-blue-500"
                  href="https://github.com/letterpad/letterpad"
                >
                  Contribute
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
