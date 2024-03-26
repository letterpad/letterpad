import Link from "next/link";


function Footer() {
  return (
    <footer className="rounded-lg shadow">
    <hr className="border-t-0 border-b-gray-200 sm:mx-auto dark:border-b-neutral-800 border-b" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4">
        <div className="flex items-center justify-center">
          <ul className="flex flex-wrap items-center text-xs font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
            <li>
              <Link href="/terms" className="hover:underline me-4 md:me-6">
                Terms
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:underline me-4 md:me-6">
                Privacy
              </Link>
            </li>
            <li>
              <Link
                target="_blank"
                className="hover:underline me-4 md:me-6"
                href="https://github.com/letterpad/letterpad"
              >
                Contribute
              </Link>
            </li>
          </ul>
        </div>
        
      </div>
    </footer>
  );
}

export default Footer;
