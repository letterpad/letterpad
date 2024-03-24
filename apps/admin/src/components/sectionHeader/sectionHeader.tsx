import classNames from "classnames";
import { useSearchParams } from "next/navigation";

export const SectionHeader = ({ heading, description, id }) => {
  const searchParams = useSearchParams();
  const selectedKey = searchParams.get("selected");
  return (
    <div className="mb-8" id={id}>
      <h2
        className={classNames("font-paragraph text-lg font-semibold", {
          "text-blue-500": selectedKey == id,
        })}
      >
        {heading}
      </h2>
      <p className="font-paragraph">{description}</p>
    </div>
  );
};
