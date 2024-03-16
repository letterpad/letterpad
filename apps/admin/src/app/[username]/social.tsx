import { Social } from "graphql-letterpad";
import {
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";

export const SocialIcons = ({ social }: { social: Social }) => {
  return (
    <div className="inline-flex gap-2">
      <SocialIcon
        icon={<FaGithub className="h-5 w-5" />}
        href={social?.github}
      />
      <SocialIcon
        icon={<FaLinkedin className="h-5 w-5" />}
        href={social?.linkedin}
      />
      <SocialIcon
        icon={<FaTwitter className="h-5 w-5" />}
        href={social?.twitter}
      />
      <SocialIcon
        icon={<FaFacebook className="h-5 w-5" />}
        href={social?.twitter}
      />
      <SocialIcon
        icon={<FaInstagram className="h-5 w-5" />}
        href={social?.twitter}
      />
    </div>
  );
};

const SocialIcon = ({ icon, href }) => {
  if (!href) {
    return null;
  }
  return (
    <a
      className="p-2 dark:hover:bg-slate-400/45 hover:bg-slate-200/45 rounded-full"
      target="_blank"
      rel="noopener noreferrer"
      href={href}
    >
      {icon}
    </a>
  );
};

export default SocialIcon;
