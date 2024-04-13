import Link from "next/link";

export const CustomLink = ({ href, children }) => {
  return (
    <Link
      data-aos="zoom-in"
      data-aos-delay="200"
      href={href}
      className="relative inline-flex items-center justify-center p-4 px-5 py-2 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out rounded-full shadow-xl group hover:ring-1 hover:ring-purple-500"
    >
      <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-700"></span>
      <span className="absolute bottom-0 right-0 block w-64 h-64 mb-32 mr-4 transition duration-500 origin-bottom-left transform rotate-45 translate-x-24 bg-pink-500 rounded-full opacity-30 group-hover:rotate-90 ease"></span>
      <span className="relative text-white">{children}</span>
    </Link>
  );
};

export const AnimatedBorder = ({ children }) => {
  return (
    <div className="relative">
      <div
        className="animated-border absolute top-0 left-0 w-full h-full"
        data-aos="fade-up"
        data-aos-delay="6000"
      ></div>
      <div
        data-aos="fade-up"
        data-aos-delay="300"
        style={{
          borderTop: "1px solid rgba(29,46,58,0.3)",
          borderRight: "1px solid rgba(29,46,58,0.5)",
          borderRadius: 10,
        }}
      >
        {children}
      </div>
    </div>
  );
};
