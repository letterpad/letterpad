import { GithubOutlined } from "@ant-design/icons";

export const SiteFooter = () => {
  return (
    <div className="flex flex-row items-center justify-between p-4 text-gray-400 shadow-md">
      <div>Letterpad, 2022. An open source project.</div>
      <div>
        <a
          href="https://github.com/letterpad/letterpad"
          target="_blank"
          rel="noreferrer"
        >
          <GithubOutlined />
        </a>
      </div>
    </div>
  );
};
