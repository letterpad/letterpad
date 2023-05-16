import { AiFillGithub } from "react-icons/ai";

export const SiteFooter = () => {
  return (
    <div className="flex flex-row items-center justify-between p-4 text-gray-400 shadow-md">
      <div>Letterpad, 2023. An open source project.</div>
      <div>
        <a
          href="https://github.com/letterpad/letterpad"
          target="_blank"
          rel="noreferrer"
        >
          <AiFillGithub size={18} />
        </a>
      </div>
    </div>
  );
};
