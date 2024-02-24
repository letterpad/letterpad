import { IoIosCheckmark } from "react-icons/io";

const Pricing = () => {
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
          <h2 className="mb-2 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white font-heading">
            Unlock full potential of Letterpad
          </h2>
          <p className="mb-5 font-light text-gray-500 sm:text-xl dark:text-gray-400 font-heading">
            More creative tools, more freedom, and more flexibility.
          </p>
        </div>
        <div className="space-y-4 lg:grid lg:grid-cols-2 sm:gap-3 xl:gap-5 lg:space-y-0">
          <Item
            title="Hobby"
            description="Best option for trying out Letterpad"
            price={0}
            items={[
              "Maximum 5 posts allowed",
              "Build Subscribers",
              "Basic Support",
              "",
              "",
            ]}
          />
          <Item
            title="Pro"
            description="Unlock full potential of Letterpad"
            price={5}
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
  );
};
export default Pricing;

const Item = ({ items, title, description, price }) => {
  return (
    <div className="flex flex-col p-4 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-6 dark:bg-gray-800 dark:text-white">
      <h3 className="mb-4 text-2xl font-semibold">{title}</h3>
      <p className="font-light text-gray-500 sm:text-lg dark:text-gray-400 font-heading">
        {description}
      </p>
      <div className="flex justify-center items-baseline my-6">
        <span className="mr-2 text-5xl font-extrabold">${price}</span>
        <span className="text-gray-500 dark:text-gray-400">/month</span>
      </div>
      <ul role="list" className="mb-8 space-y-1 text-left">
        {items.map((item) => (
          <li className="flex items-center space-x-3 font-paragraph" key={item}>
            <IoIosCheckmark
              size={32}
              className={"text-green-500 " + (!item ? "opacity-0" : "")}
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <a
        href="#"
        className="text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white  dark:focus:ring-primary-900"
      >
        Get started
      </a>
    </div>
  );
};
