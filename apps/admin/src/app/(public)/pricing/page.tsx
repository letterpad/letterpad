import { IoMdCheckmark } from "react-icons/io";

const Pricing = () => {
  return (
    <>
      <section className="bg-white dark:bg-gray-900">
        <div className="py-8 px-4 mx-auto max-w-screen-md lg:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
            <h2 className="mb-2 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white font-heading">
              Pricing
            </h2>
            <p className="mb-5 font-light text-gray-500 sm:text-xl dark:text-gray-400 font-heading">
              More creative tools, more freedom, and more flexibility.
            </p>
          </div>
          <div className="space-y-4 lg:grid lg:grid-cols-2 sm:gap-3 xl:gap-5 lg:space-y-0">
            <Item
              title="Free"
              label="Sign Up for free"
              items={[
                "Maximum 5 posts allowed",
                "Build Subscribers",
                "Basic Support",
                null,
                null,
                null,
                null,
              ]}
            />
            <Item
              title="Pro"
              label="Sign Up for $5/month"
              items={[
                "Unlimited Posts",
                "Domain Mapping",
                "Analytics",
                "Creatives to create photo blog page",
                "Custom Email Template for Subscribers",
                "Pro Badge",
                "And more...",
              ]}
            />
          </div>
        </div>
      </section>
    </>
  );
};
export default Pricing;

const Item = ({ items, title, label }) => {
  return (
    <div className="flex flex-col p-3 mx-auto max-w-md text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-6 dark:bg-gray-800 dark:text-white">
      <h3 className="mb-4 pb-2 text-lg font-semibold border-b dark:border-gray-700 border-gray-200">
        {title}
      </h3>
      <ul role="list" className="mb-8 space-y-1 text-left text-sm">
        {items.map((item) => (
          <li
            className="flex items-center space-x-2 font-paragraph h-6"
            key={item}
          >
            {item && <IoMdCheckmark size={14} className={"text-green-500"} />}
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <a
        href="#"
        className="text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2 text-center dark:text-white  dark:focus:ring-primary-900"
      >
        {label}
      </a>
    </div>
  );
};
