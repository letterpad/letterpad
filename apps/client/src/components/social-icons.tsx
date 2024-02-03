import { MeFragmentFragment } from 'letterpad-sdk';
import SocialIcon from '../../components/social-icons';
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaRss,
} from 'react-icons/fa';

export const SocialIcons = ({ me }: { me: MeFragmentFragment }) => {
  return (
    <div className="inline-flex gap-2">
      <SocialIcon
        icon={<FaGithub className="h-5 w-5" />}
        href={me.social?.github}
      />
      <SocialIcon
        icon={<FaLinkedin className="h-5 w-5" />}
        href={me.social?.linkedin}
      />
      <SocialIcon
        icon={<FaTwitter className="h-5 w-5" />}
        href={me.social?.twitter}
      />
      <SocialIcon
        icon={<FaFacebook className="h-5 w-5" />}
        href={me.social?.twitter}
      />
      <SocialIcon
        icon={<FaInstagram className="h-5 w-5" />}
        href={me.social?.twitter}
        size={5}
      />
    </div>
  );
};
